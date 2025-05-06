-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('USER', 'AI', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ProfileSource" AS ENUM ('USER_INPUT', 'AI_ANALYSIS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('PERSONALITY', 'RELATIONSHIP', 'DAILY', 'MBTI');

-- CreateEnum
CREATE TYPE "PushStatus" AS ENUM ('SCHEDULED', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "mbti" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "status" "RelationshipStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "is_question_response" BOOLEAN NOT NULL DEFAULT false,
    "is_user_initiated" BOOLEAN NOT NULL DEFAULT true,
    "analyzed_by_llm" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_code" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_static" BOOLEAN NOT NULL DEFAULT false,
    "source" "ProfileSource" NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persona_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advice_reports" (
    "id" TEXT NOT NULL,
    "relationship_id" TEXT NOT NULL,
    "generated_by" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "advice_for_user1" TEXT NOT NULL,
    "advice_for_user2" TEXT NOT NULL,

    CONSTRAINT "advice_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_templates" (
    "id" TEXT NOT NULL,
    "category_code" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_schedules" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "status" "PushStatus" NOT NULL,

    CONSTRAINT "push_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_histories" ADD CONSTRAINT "chat_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_profiles" ADD CONSTRAINT "persona_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_reports" ADD CONSTRAINT "advice_reports_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "relationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_reports" ADD CONSTRAINT "advice_reports_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_schedules" ADD CONSTRAINT "push_schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_schedules" ADD CONSTRAINT "push_schedules_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
