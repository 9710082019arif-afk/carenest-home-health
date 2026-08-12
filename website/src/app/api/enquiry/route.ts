import { handleLeadForm } from "@/lib/form-handler";

export async function POST(req: Request) {
  return handleLeadForm(req, "enquiry");
}
