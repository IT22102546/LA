import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { User, GraduationCap, Edit2 } from "lucide-react";

const DashStudentProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="cursor-pointer hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              ←
            </span>
            <span
              className="cursor-pointer hover:text-foreground"
              onClick={() => navigate("/?tab=student-enrollment")}
            >
              Students Enrolment
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-foreground">
              Intern Student
            </span>
            <span>/</span>
            <span className="text-foreground">Student Profile</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Student Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              View Comprehensive Student Details and Training Status
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  John Mickeal Mahendran
                </h2>
                <p className="text-muted-foreground">
                  Student ID: STU-2024-001
                </p>
                <Badge className="mt-2 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))] text-white">
                  ● Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
            <TabsTrigger
              value="info"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Info
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6 space-y-6">
            {/* Personal Details */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Personal Details
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Date of Birth
                    </label>
                    <p className="text-foreground font-medium mt-1">
                      19/07.85.49
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Phone
                    </label>
                    <p className="text-foreground font-medium mt-1">
                      0777998767
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">
                      Email
                    </label>
                    <p className="text-foreground font-medium mt-1">
                      shakco0@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Acaramic Information
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      District
                    </label>
                    <p className="text-foreground font-medium mt-1">Colombo</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Zone
                    </label>
                    <p className="text-foreground font-medium mt-1">Dehiwela</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Grade
                    </label>
                    <p className="text-foreground font-medium mt-1">Grade 10</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      School
                    </label>
                    <p className="text-foreground font-medium mt-1">
                      D.S.Seninauaka collage
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Medium
                    </label>
                    <p className="text-foreground font-medium mt-1">Tamil</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Instcution
                    </label>
                    <p className="text-foreground font-medium mt-1">
                      Piumal Vithagan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Payment information will be displayed here
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashStudentProfile;
