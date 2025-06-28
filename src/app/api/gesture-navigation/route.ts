import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const schedules = await prisma.logGestureNavigation.findMany()
  return NextResponse.json(schedules)
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gestureType,
      actionTarget,
      status,
      confidence,
      userAgent
    } = body;

    if (!gestureType || !actionTarget || !status || confidence === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const log = await prisma.logGestureNavigation.create({
      data: {
        gestureType,
        actionTarget,
        status,
        confidence,
        userAgent
      }
    });
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log', details: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
