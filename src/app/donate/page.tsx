import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Heart, Globe, Smartphone, Info } from "lucide-react";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Support DropToGit",
};

export default function DonatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-soft">
              <Heart className="h-7 w-7 text-brand-green" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Support <span className="text-gradient-green">DropToGit</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              DropToGit is free to use and always will be for its core features.
              If it saved you time, you can support ongoing development with a
              donation below. No account, no subscription — just a direct
              thank-you.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {/* Ghana Mobile Money */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-brand-green" />
                  <CardTitle className="text-lg">Ghana Mobile Money</CardTitle>
                </div>
                <CardDescription>
                  Send directly via MTN MoMo or Telecel Cash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Network</TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="outline">MTN MoMo</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        0535343490
                      </TableCell>
                      <TableCell>Vivian Ahorlu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="outline">Telecel Cash</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        0209558038
                      </TableCell>
                      <TableCell>Bright Dumashie</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* International Bank Transfer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-green" />
                  <CardTitle className="text-lg">
                    International USD Bank Transfer
                  </CardTitle>
                </div>
                <CardDescription>
                  For supporters outside Ghana — USD transfers via Lead Bank
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Field</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Bank</TableCell>
                      <TableCell>Lead Bank (USA)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Beneficiary
                      </TableCell>
                      <TableCell>Bright Dumashie</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Account Number
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        210633430016
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Routing Number
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        101019644
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Account Type
                      </TableCell>
                      <TableCell>Checking</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Bank Address
                      </TableCell>
                      <TableCell>1801 Main St., Kansas City, MO 64108</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Beneficiary Address
                      </TableCell>
                      <TableCell>
                        Adenta, Pine Street, Accra, 00233, Ghana
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Donations are processed manually and are not linked to any
                account or feature unlock — this project remains fully open
                regardless of donation status.
              </p>
            </div>

            {/* Coming Soon */}
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Automated card / mobile checkout via Paystack is on the roadmap.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}