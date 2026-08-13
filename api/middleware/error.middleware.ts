import type { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error: any) {
    console.error(error);

    ctx.status = error.status || error.statusCode || 500;
    
    ctx.body = {
      success: false,
      message: error.status && error.status < 500 
        ? error.message 
        : "Internal server error",
    };
  }
}