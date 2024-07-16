"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CallsCard from "@/components/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resetAllCalls } from "@/lib/utils";
import { toast } from "sonner";

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [archivedCalls, setArchivedCalls] = useState([]);
  const [unArchivedCalls, setUnArchivedCalls] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://aircall-backend.onrender.com/activities"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      // filter archived and unarchived calls
      const archivedCalls = data.filter((call) => call.is_archived === true);
      const unArchivedCalls = data.filter((call) => call.is_archived === false);

      console.log({ archivedCalls, unArchivedCalls });
      setArchivedCalls(archivedCalls);
      setUnArchivedCalls(unArchivedCalls);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className=" w-[450px] py-8 px-8">
        <CardHeader className="p-0">
          <CardTitle>AirCalls</CardTitle>
          <CardDescription>See the calls that you got</CardDescription>
        </CardHeader>

        <Tabs defaultValue="all" className="my-4 w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="w-full">
              All
            </TabsTrigger>
            <TabsTrigger value="archived" className="w-full">
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="w-full">
            <CardContent className=" gap-4 my-4  p-0">
              <ScrollArea className="h-[300px]  w-full rounded-md">
                <div className="flex flex-col gap-4 py-4">
                  {unArchivedCalls?.map((question, idx) => (
                    <div key={idx}>
                      <CallsCard
                        details={question}
                        fetchQuestions={fetchQuestions}
                        setOpenDialog={setOpenDialog}
                      />
                    </div>
                  ))}
                  {unArchivedCalls?.length === 0 && (
                    <div className="flex w-full items-center justify-center">
                      No calls found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
          <TabsContent value="archived">
            <CardContent className=" gap-4 my-4  p-0">
              {archivedCalls?.length !== 0 && (
                <div className="flex items-end justify-end">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      const response = await resetAllCalls();
                      if (response.ok) {
                        fetchQuestions();
                        toast("Call status has been reset.");
                      }
                    }}
                  >
                    Reset status
                  </Button>
                </div>
              )}

              <ScrollArea className="h-[300px]  w-full rounded-md">
                <div className="flex flex-col gap-4 py-4">
                  {archivedCalls?.map((question, idx) => (
                    <div key={idx}>
                      <CallsCard
                        details={question}
                        fetchQuestions={fetchQuestions}
                        setOpenDialog={setOpenDialog}
                      />
                    </div>
                  ))}

                  {archivedCalls?.length === 0 && (
                    <div className="flex w-full items-center justify-center">
                      No calls found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
