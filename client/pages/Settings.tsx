import React from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Header pageSubtitle="Settings" />
      <main className="container mx-auto px-6 py-10 max-w-3xl">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Use the theme toggle in the header to switch between light and dark.</p>
            </section>
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email notifications</Label>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="careerTips">Career tips</Label>
                <Switch id="careerTips" defaultChecked />
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
