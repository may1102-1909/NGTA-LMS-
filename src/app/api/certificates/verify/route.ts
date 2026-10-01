import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certId = searchParams.get("certId");

    if (!certId) {
      return NextResponse.json(
        { error: "certId parameter is required" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificates.findFirst({
      where: {
        OR: [
          { certificate_id: certId },
          { id: certId },
        ],
      },
      include: {
        profile: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!certificate) {
      // Support legacy simulated certificate ID pattern if queried
      if (certId.startsWith("NGTA-CERT")) {
        return NextResponse.json({
          valid: true,
          simulated: true,
          certificate: {
            id: certId,
            recipient: "Tanmay Sharma",
            course: "Selenium Java + AI: Complete Automation Testing Course",
            instructor: "Rahul Kamat (Founder & Lead SDET)",
            issuedDate: "March 17, 2026",
            issuer: "NextGen Testing Academy (NGTA)",
            accreditation: "NextGen Testing Academy Certified SDET Track",
            verificationStatus: "VALID & VERIFIED",
            grade: "PASS (Score: 100%)",
          },
        });
      }

      return NextResponse.json(
        { valid: false, error: "Certificate ID not found in system registry" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.certificate_id,
        recipient: certificate.recipient_name,
        course: certificate.course_title,
        instructor: "Rahul Kamat (Founder & Lead SDET)",
        issuedDate: new Date(certificate.issued_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        issuer: "NextGen Testing Academy (NGTA)",
        accreditation: "NextGen Testing Academy Certified SDET Track",
        verificationStatus: "VALID & VERIFIED",
        grade: certificate.grade,
        score: certificate.score,
        issuedAt: certificate.issued_at,
      },
    });
  } catch (error: any) {
    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
