// app/api/add-doctor/route.ts
import { NextRequest, NextResponse } from "next/server";
import Doctor from "@/models/Doctor";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();

    // Validate required fields
    if (
      !body.name ||
      !body.specialty ||
      !body.experience ||
      !body.location ||
      !body.fee
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new doctor with only the allowed fields
    const newDoctor = new Doctor({
      name: body.name,
      specialty: body.specialty,
      experience: Number(body.experience),
      location: body.location,
      clinic: body.clinic || undefined,
      fee: Number(body.fee),
      onlineFee: body.onlineFee ? Number(body.onlineFee) : undefined,
      visitFee: body.visitFee ? Number(body.visitFee) : undefined,
      qualifications: body.qualifications || undefined,
    });

    await newDoctor.save();

    return NextResponse.json(
      { success: true, doctor: newDoctor },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error saving doctor:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Error occurred",
        errors: err.errors
          ? Object.values(err.errors).map((e: any) => e.message)
          : null,
      },
      { status: 400 }
    );
  }
}
