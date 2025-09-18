import { AuthForm } from "@/components/auth-form"
import { Users, Shield, BookOpen, Award, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Next-Gen Learning Platform
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Smart CBT
                  </span>
                  <br />
                  <span className="text-foreground">Platform</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                  Experience the future of education with our AI-powered Computer-Based Testing platform. Create
                  classrooms, manage assignments, and conduct secure assessments with zero cheating.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">Classroom Management</h3>
                  <p className="text-xs text-muted-foreground">Create and manage virtual classrooms</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
                  <Shield className="w-8 h-8 text-secondary mb-2" />
                  <h3 className="font-semibold text-sm">Zero Cheating</h3>
                  <p className="text-xs text-muted-foreground">AI-powered anti-cheat detection</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">Smart Assignments</h3>
                  <p className="text-xs text-muted-foreground">Dynamic quiz and test creation</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
                  <Award className="w-8 h-8 text-secondary mb-2" />
                  <h3 className="font-semibold text-sm">Real-time Analytics</h3>
                  <p className="text-xs text-muted-foreground">Track performance instantly</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-sm text-muted-foreground">Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className="fixed top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-float"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="fixed top-40 right-20 w-6 h-6 bg-secondary/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="fixed bottom-20 left-20 w-3 h-3 bg-accent/20 rounded-full animate-float"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>
  )
}
