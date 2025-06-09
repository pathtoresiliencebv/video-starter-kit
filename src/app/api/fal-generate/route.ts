import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, template } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a visual prompt based on the script and template
    const visualPrompt = `Create a professional background image for a YouTube Short about: ${prompt}. Style: modern, clean, high-quality, suitable for ${template} content. 9:16 aspect ratio, vibrant colors, engaging visual.`;

    console.log('Generating visual with FAL.ai:', visualPrompt);

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: visualPrompt,
        image_size: "portrait_16_9",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FAL.ai API error:', errorText);
      throw new Error(`FAL.ai API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('FAL.ai response:', data);

    return NextResponse.json({ 
      imageUrl: data.images[0].url,
      prompt: visualPrompt
    });
  } catch (error) {
    console.error('FAL.ai API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate visual content' },
      { status: 500 }
    );
  }
}
