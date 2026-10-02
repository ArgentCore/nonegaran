import { prisma } from "@/lib/prisma"
import type { Prisma, EmailStatus } from "@prisma/client"

export const emailLogInclude = {
  order: { select: { id: true, totalAmount: true } },
} as const

export type EmailLogWithOrder = Prisma.EmailLogGetPayload<{
  include: typeof emailLogInclude
}>

export interface EmailFilters {
  status?: EmailStatus
  template?: string
}

export async function getEmailLogs(
  filters: EmailFilters = {},
  take = 50
): Promise<EmailLogWithOrder[]> {
  return prisma.emailLog.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.template ? { template: filters.template } : {}),
    },
    include: emailLogInclude,
    orderBy: { createdAt: "desc" },
    take,
  })
}

export async function getEmailLogById(
  id: string
): Promise<EmailLogWithOrder | null> {
  return prisma.emailLog.findUnique({
    where: { id },
    include: emailLogInclude,
  })
}

export async function getQueuedEmailCount(): Promise<number> {
  return prisma.emailLog.count({ where: { status: "queued" } })
}

export async function getFailedEmailCount(): Promise<number> {
  return prisma.emailLog.count({ where: { status: "failed" } })
}