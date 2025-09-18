"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Mail, Calendar } from "lucide-react"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("performance")
  const [timeRange, setTimeRange] = useState("last-month")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["scores", "participation", "security"])
  const [format, setFormat] = useState("pdf")

  const handleMetricChange = (metric: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics([...selectedMetrics, metric])
    } else {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
    }
  }

  const generateReport = () => {
    const reportData = {
      type: reportType,
      timeRange,
      metrics: selectedMetrics,
      format,
      generatedAt: new Date().toISOString(),
    }

    console.log("[v0] Generating report:", reportData)

    // Simulate report generation
    setTimeout(() => {
      alert(`${format.toUpperCase()} report generated successfully!`)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Generator
        </CardTitle>
        <CardDescription>Create custom analytics reports for export</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Report</SelectItem>
                <SelectItem value="security">Security Report</SelectItem>
                <SelectItem value="student">Student Progress Report</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Include Metrics</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "scores", label: "Score Analysis" },
              { id: "participation", label: "Participation Rates" },
              { id: "security", label: "Security Events" },
              { id: "trends", label: "Performance Trends" },
              { id: "individual", label: "Individual Progress" },
              { id: "questions", label: "Question Analysis" },
            ].map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={(checked) => handleMetricChange(metric.id, checked as boolean)}
                />
                <Label htmlFor={metric.id} className="text-sm">
                  {metric.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
              <SelectItem value="csv">CSV Data</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button onClick={generateReport} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="outline">
            {selectedMetrics.length} metrics selected • {format.toUpperCase()} format
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
