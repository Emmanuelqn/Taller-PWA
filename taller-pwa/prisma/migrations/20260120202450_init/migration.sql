-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'ANALYST');

-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('MOBILE_APP', 'WEB_APP', 'ENTERPRISE_SYSTEM', 'API_BACKEND', 'ECOMMERCE', 'SAAS', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SCOPE_CLARIFICATION', 'TECHNICAL_REQUIREMENT', 'FUNCTIONAL_REQUIREMENT', 'INTEGRATION', 'SECURITY', 'SCALABILITY', 'BUDGET_TIMELINE');

-- CreateEnum
CREATE TYPE "TextExtractionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('REQUIREMENTS_DOCUMENT', 'USER_STORY', 'USE_CASE', 'TECHNICAL_SPEC', 'BUSINESS_RULES', 'WIREFRAME', 'CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "EstimationModel" AS ENUM ('COCOMO', 'FUNCTION_POINTS', 'USE_CASE_POINTS', 'STORY_POINTS', 'EXPERT_JUDGMENT', 'ANALOGOUS', 'THREE_POINT', 'PARAMETRIC');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "last_login_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT 'Nueva conversación',
    "description" TEXT,
    "status" "ChatStatus" NOT NULL DEFAULT 'ACTIVE',
    "project_type" "ProjectType",
    "is_analysis_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "token_count" INTEGER,
    "model_used" VARCHAR(100),
    "question_type" "QuestionType",
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_extension" VARCHAR(10) NOT NULL,
    "storage_path" TEXT NOT NULL,
    "storage_url" TEXT,
    "extracted_text" TEXT,
    "text_extraction_status" "TextExtractionStatus" NOT NULL DEFAULT 'PENDING',
    "extraction_error" TEXT,
    "document_type" "DocumentType",
    "page_count" INTEGER,
    "word_count" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_predictions" (
    "id" UUID NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "project_summary" TEXT NOT NULL,
    "scope_description" TEXT NOT NULL,
    "technology_stack" JSONB NOT NULL,
    "required_profiles" JSONB NOT NULL,
    "estimated_hours" INTEGER NOT NULL,
    "estimated_weeks" DOUBLE PRECISION NOT NULL,
    "estimated_months" DOUBLE PRECISION NOT NULL,
    "module_breakdown" JSONB NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "cost_breakdown" JSONB NOT NULL,
    "additional_services" JSONB,
    "risks" JSONB,
    "assumptions" JSONB,
    "estimation_model" "EstimationModel" NOT NULL,
    "confidence_level" INTEGER NOT NULL DEFAULT 75,
    "estimated_lines_of_code" INTEGER,
    "complexity_score" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "technical_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_feedback" (
    "id" UUID NOT NULL,
    "actual_hours" INTEGER,
    "actual_cost" DECIMAL(12,2),
    "actual_duration_weeks" DOUBLE PRECISION,
    "hours_variance" DOUBLE PRECISION,
    "cost_variance" DOUBLE PRECISION,
    "accuracy_rating" INTEGER,
    "comments" TEXT,
    "lessons_learned" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "prediction_id" UUID NOT NULL,

    CONSTRAINT "prediction_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "chats_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE INDEX "chats_created_at_idx" ON "chats"("created_at");

-- CreateIndex
CREATE INDEX "messages_chat_id_idx" ON "messages"("chat_id");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "uploaded_files_user_id_idx" ON "uploaded_files"("user_id");

-- CreateIndex
CREATE INDEX "uploaded_files_chat_id_idx" ON "uploaded_files"("chat_id");

-- CreateIndex
CREATE INDEX "uploaded_files_created_at_idx" ON "uploaded_files"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "technical_predictions_chat_id_key" ON "technical_predictions"("chat_id");

-- CreateIndex
CREATE INDEX "technical_predictions_created_at_idx" ON "technical_predictions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_feedback_prediction_id_key" ON "prediction_feedback"("prediction_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_predictions" ADD CONSTRAINT "technical_predictions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
