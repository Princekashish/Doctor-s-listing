import { NextRequest, NextResponse } from "next/server";
import Doctor from "@/models/Doctor";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  // Pagination
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  // Filter parameters
  const specialty = searchParams.get("specialty");
  const location = searchParams.get("location");
  const minFee = Number(searchParams.get("minFee") || 0);
  const maxFee = Number(searchParams.get("maxFee") || 1000000);

  // Array parameters (comma-separated)
  const experience = searchParams.get("experience")?.split(",") || [];
  const consultMode = searchParams.get("consultMode")?.split(",") || [];
  const language = searchParams.get("language")?.split(",") || [];
  const feeRange = searchParams.get("feeRange")?.split(",") || [];

  // Build the query object
  const query: any = {
    fee: { $gte: minFee, $lte: maxFee },
  };

  // Specialty filter
  if (specialty) {
    query.specialty = { $regex: new RegExp(specialty, "i") };
  }

  // Location filter
  if (location) {
    query.location = { $regex: new RegExp(location, "i") };
  }

  // Experience filter
  if (experience.length > 0) {
    const experienceConditions = experience
      .map((exp) => {
        const expNum = Number(exp);
        if (expNum === 5) return { experience: { $lte: 5 } };
        if (expNum === 10) return { experience: { $gt: 5, $lte: 10 } };
        if (expNum === 16) return { experience: { $gt: 10, $lte: 16 } };
        return null;
      })
      .filter((cond) => cond !== null);

    if (experienceConditions.length > 0) {
      if (!query.$and) query.$and = [];
      query.$and.push({ $or: experienceConditions });
    }
  }

  // Consult mode filter
  if (consultMode.length > 0) {
    const consultConditions = [];
    if (consultMode.includes("online")) {
      consultConditions.push({ onlineFee: { $exists: true, $gt: 0 } });
    }
    if (consultMode.includes("hospital")) {
      consultConditions.push({ visitFee: { $exists: true, $gt: 0 } });
    }
    if (consultConditions.length > 0) {
      if (!query.$and) query.$and = [];
      query.$and.push({ $or: consultConditions });
    }
  }

  // Language filter
  if (language.length > 0) {
    query.languages = { $in: language };
  }

  // Fee range filter
  if (feeRange.length > 0) {
    const feeConditions = feeRange
      .map((range) => {
        if (range === "100-500") return { fee: { $gte: 100, $lte: 500 } };
        if (range === "500-1000") return { fee: { $gt: 500, $lte: 1000 } };
        if (range === "1000+") return { fee: { $gt: 1000 } };
        return null;
      })
      .filter((cond) => cond !== null);

    if (feeConditions.length > 0) {
      if (!query.$and) query.$and = [];
      query.$and.push({ $or: feeConditions });
    }
  }
  try {
    const doctors = await Doctor.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Doctor.countDocuments(query);

    return NextResponse.json({
      doctors,
      total,
      page,
      limit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error fetching doctors", error: err.message },
      { status: 500 }
    );
  }
}
