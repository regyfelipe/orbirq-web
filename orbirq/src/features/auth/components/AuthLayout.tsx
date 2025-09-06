import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full md:min-w-[600px] md:max-w-xl shadow-2xl rounded-3xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
