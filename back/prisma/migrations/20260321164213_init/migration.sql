-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "cpf" TEXT,
    "phone" TEXT,
    "institution" TEXT,
    "qrCodeToken" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL,
    "edition" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "bannerUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "ogImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventCoordinator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "EventCoordinator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventCoordinator_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "label" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EventDay_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" INTEGER,
    "description" TEXT,
    "eventDayId" TEXT NOT NULL,
    CONSTRAINT "EventLocation_eventDayId_fkey" FOREIGN KEY ("eventDayId") REFERENCES "EventDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'TALK',
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "speaker" TEXT,
    "speakerBio" TEXT,
    "speakerPhoto" TEXT,
    "eventDayId" TEXT NOT NULL,
    "locationId" TEXT,
    "durationHours" REAL,
    CONSTRAINT "Activity_eventDayId_fkey" FOREIGN KEY ("eventDayId") REFERENCES "EventDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "EventLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedBy" TEXT,
    CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "totalHours" REAL NOT NULL DEFAULT 0,
    "pdfUrl" TEXT,
    CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CertificateTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CertificateTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "htmlTemplate" TEXT NOT NULL,
    "minHours" REAL NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'PARTICIPATION',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CertificateTemplate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "eventId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Sponsor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_qrCodeToken_key" ON "User"("qrCodeToken");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventCoordinator_userId_eventId_key" ON "EventCoordinator"("userId", "eventId");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "EventRegistration"("eventId", "userId");

-- CreateIndex
CREATE INDEX "Attendance_activityId_idx" ON "Attendance"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_activityId_key" ON "Attendance"("userId", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_code_key" ON "Certificate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_eventId_templateId_key" ON "Certificate"("userId", "eventId", "templateId");
