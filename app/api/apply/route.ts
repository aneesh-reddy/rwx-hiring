import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const github = formData.get('github') as string;
    const linkedin = formData.get('linkedin') as string;
    const years = formData.get('years') as string;
    const why = formData.get('why') as string;
    
    // Safe JSON parsing fallback
    const rawTools = formData.get('cicdTools');
    const cicdTools = rawTools ? JSON.parse(rawTools as string) : [];
    
    const resumeFile = formData.get('resume') as File | null;

    let resumeUrl = null;
    if (resumeFile && resumeFile.size > 0) {
      // Prevent file name collisions with a random string
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${Date.now()}-${randomString}-${resumeFile.name.replace(/\s+/g, '-')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);
      resumeUrl = publicUrlData.publicUrl;
    }

    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .upsert({ name, email, github, linkedin }, { onConflict: 'email' })
      .select()
      .single();

    if (candidateError) throw candidateError;

    const { error: appError } = await supabase.from('applications').insert({
      candidate_id: candidate.id,
      years_exp: years,
      cicd_tools: cicdTools,
      why_rwx: why,
      resume_url: resumeUrl,
    });

    if (appError) throw appError;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}