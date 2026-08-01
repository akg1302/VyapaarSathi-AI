import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error { constructor(public statusCode: number, message: string, public details?: unknown) { super(message); } }
export class NotFoundError extends AppError { constructor(resource: string) { super(404, `${resource} not found`); } }
export class UnauthorizedError extends AppError { constructor() { super(401, "Authentication required"); } }
export function errorResponse(error: unknown) { if (error instanceof ZodError) return NextResponse.json({ error: { message: "Invalid request", details: error.flatten() } }, { status: 400 }); if (error instanceof AppError) return NextResponse.json({ error: { message: error.message, details: error.details } }, { status: error.statusCode }); console.error("Unhandled API error", error); return NextResponse.json({ error: { message: "An unexpected error occurred" } }, { status: 500 }); }
