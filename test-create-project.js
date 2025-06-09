// Test script to verify the create-project API
const testData = {
  prompt: "Test editor integration - create a short video about AI tools",
  script: "Hey there! Welcome to our AI tools tutorial. Today we'll explore amazing AI technologies that can transform your content creation workflow. From script generation to voice synthesis, these tools are game-changers!",
  selectedVoice: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
  selectedTemplate: "educational",
  audioUrl: "https://example.com/test-audio.mp3",
  visualUrl: "https://example.com/test-visual.png",
  selectedMusic: "Rise Up",
  musicUrl: "https://example.com/test-music.mp3",
  musicType: "library",
  captions: [
    { id: 1, start: 0.0, end: 2.5, text: "Hey there! Welcome to our AI tools tutorial." },
    { id: 2, start: 2.5, end: 5.0, text: "Today we'll explore amazing AI technologies" },
    { id: 3, start: 5.0, end: 8.0, text: "that can transform your content creation workflow." }
  ]
};

fetch('http://localhost:3003/api/create-project', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('API Response:', data);
  if (data.success) {
    console.log('✅ Project created successfully!');
    console.log('Project ID:', data.projectId);
    console.log('Editor URL:', data.editorUrl);
  } else {
    console.log('❌ Error:', data.error);
  }
})
.catch(error => {
  console.error('❌ Request failed:', error);
});
