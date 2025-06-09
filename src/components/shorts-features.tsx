import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Mic, Palette, Download, Clock } from "lucide-react";

export default function ShortsFeatures() {
  return (
    <section className="py-20 lg:py-32 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Everything You Need to Create
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Professional YouTube Shorts
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform handles every aspect of video creation, from script writing to final export.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">AI Script Generation</CardTitle>
              <CardDescription className="text-gray-400">
                Transform any idea into engaging, viral-ready scripts optimized for YouTube Shorts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Professional Voice-Over</CardTitle>
              <CardDescription className="text-gray-400">
                Choose from premium AI voices to bring your scripts to life with natural speech
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-pink-400" />
              </div>
              <CardTitle className="text-white">Stunning Visual Templates</CardTitle>
              <CardDescription className="text-gray-400">
                5 professionally designed templates for different content styles and niches
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-white">One-Click Export</CardTitle>
              <CardDescription className="text-gray-400">
                Export your finished Shorts in perfect 9:16 format, ready for YouTube upload
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-gray-400">
                Create professional YouTube Shorts in under 5 minutes from idea to export
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">No Skills Required</CardTitle>
              <CardDescription className="text-gray-400">
                Perfect for beginners - no video editing experience needed
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Free</CardTitle>
              <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold text-white mt-4">$0<span className="text-lg text-gray-400">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">3 YouTube Shorts per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">All 5 basic templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">AI script generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Basic voice options</span>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <span className="w-5 h-5 text-gray-500">•</span>
                  <span className="text-gray-500">Watermarked exports</span>
                </div>
              </div>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/50 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
              Most Popular
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Pro</CardTitle>
              <CardDescription className="text-gray-300">For serious content creators</CardDescription>
              <div className="text-4xl font-bold text-white mt-4">$10<span className="text-lg text-gray-400">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Unlimited YouTube Shorts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">All templates + premium styles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Premium AI voices</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">No watermarks</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Priority support</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
