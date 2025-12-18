import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  MapPin,
  ExternalLink,
} from "lucide-react";
import type { CareerRecommendation } from "@/pages/Index";

interface CareerRecommendationCardProps {
  career: CareerRecommendation;
  getCareerIcon: (title: string) => React.ComponentType<{ className?: string }>;
  getMatchScoreColor: (score: number) => string;
  getDifficultyColor: (difficulty: string) => string;
}

const CareerRecommendationCard = memo(
  ({
    career,
    getCareerIcon,
    getMatchScoreColor,
    getDifficultyColor,
  }: CareerRecommendationCardProps) => {
    const IconComponent = getCareerIcon(career.title);

    return (
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                  {career.title}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {career.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getMatchScoreColor(career.matchScore)}`}
              >
                {career.matchScore}%
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Match Score
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Salary Range</span>
              </div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                {career.averageSalary}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Job Growth</span>
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {career.jobGrowth}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Time to Start</span>
              </div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                {career.timeToStart}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <div className="flex items-center text-orange-700 dark:text-orange-300 mb-1">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Difficulty</span>
              </div>
              <Badge className={getDifficultyColor(career.difficulty)}>
                {career.difficulty}
              </Badge>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Required Skills */}
              <div>
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {career.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Learning Path */}
              <div>
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Learning Path
                </h4>
                <div className="flex flex-wrap gap-1">
                  {career.learningPath.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div>
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Top Hiring Companies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {career.topCompanies.slice(0, 4).map((company) => (
                    <Badge key={company} variant="secondary" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-4">
              {/* Required Skills */}
              <div>
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {career.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div>
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Top Hiring Companies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {career.topCompanies.slice(0, 4).map((company) => (
                    <Badge key={company} variant="secondary" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-4 mt-4">
              {career.roadmap.map((level, i) => (
                <div key={i} className="border-l-2 border-indigo-200 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-rose-500 dark:bg-rose-400 rounded-full -ml-6 mr-3"></div>
                    <h5 className="font-medium text-sm">{level.level}</h5>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Duration: {level.duration}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {level.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="courses" className="space-y-3 mt-4">
              {career.courses.map((course, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm">{course.title}</h5>
                    <Badge
                      variant={
                        course.type === "free" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {course.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {course.provider} • {course.duration}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-rose-600 dark:text-rose-400"
                    asChild
                  >
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Course <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h5 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
                  Certifications
                </h5>
                {career.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <div>
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        {cert.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        {cert.provider} • {cert.difficulty}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400"
                      asChild
                    >
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-3 mt-4">
              {career.locations.map((location, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{location.city}</span>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        location.demand === "High"
                          ? "default"
                          : location.demand === "Medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs mb-1"
                    >
                      {location.demand} Demand
                    </Badge>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {location.avgSalary}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
);

CareerRecommendationCard.displayName = "CareerRecommendationCard";

export default CareerRecommendationCard;