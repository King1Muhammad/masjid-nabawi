import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { HomeIcon, AlertTriangle, Upload, Copy, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainLayout from "@/components/layouts/main-layout";

const PaymentPage = () => {
  const { toast } = useToast();
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("community");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "تفصیلات کاپی ہو گئیں",
    });
  };
  
  // Handle receipt upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };
  
  // Payment submission mutation
  const submitPaymentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('پیمنٹ جمع کرانے میں مسئلہ ہوا');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "کامیابی!",
        description: "آپ کی پیمنٹ کی تفصیلات جمع کر لی گئیں، انتظامیہ جلد ہی تصدیق کرے گی",
        variant: "default",
      });
      
      // Reset form
      setPaymentReference("");
      setPaymentDate("");
      setPaymentAmount("");
      setReceiptFile(null);
      setNotes("");
    },
    onError: (error) => {
      toast({
        title: "خرابی",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Submit payment function
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentReference || !paymentDate || !paymentAmount) {
      toast({
        title: "ضروری معلومات",
        description: "براہ کرم تمام ضروری فیلڈز کو پُر کریں",
        variant: "destructive",
      });
      return;
    }
    
    if (!receiptFile) {
      toast({
        title: "رسید ضروری ہے",
        description: "براہ کرم پیمنٹ کی رسید اپلوڈ کریں",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("reference", paymentReference);
    formData.append("date", paymentDate);
    formData.append("amount", paymentAmount);
    formData.append("type", paymentType);
    formData.append("notes", notes);
    formData.append("receipt", receiptFile);
    
    submitPaymentMutation.mutate(formData);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-3 md:px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">فیس ادائیگی</h1>
            <p className="text-muted-foreground">کمیونٹی رہائشی فیس اور مدرسہ فیس کی ادائیگی کے لیے</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex gap-2">
              <HomeIcon size={16} />
              ہوم پیج
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="community" onValueChange={setPaymentType}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="community">کمیونٹی ماہانہ فیس</TabsTrigger>
            <TabsTrigger value="madrasa">مدرسہ فیس</TabsTrigger>
          </TabsList>
          
          <TabsContent value="community">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>کمیونٹی رہائشی فیس کی معلومات</CardTitle>
                  <CardDescription>ہر فلیٹ کی ماہانہ فیس 1,500 روپے</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>یاد رکھیں</AlertTitle>
                      <AlertDescription>
                        براہ کرم پیمنٹ کرنے کے بعد رسید اپلوڈ کریں تاکہ آپ کی ادائیگی کی تصدیق کی جا سکے
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">اکاؤنٹ نمبر:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">0541003765900001</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard("0541003765900001")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">PK31JSBL9999903468053268</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard("PK31JSBL9999903468053268")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">بینک:</span>
                        <span className="font-bold">JS Bank</span>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">اکاؤنٹ ہولڈر:</span>
                        <span className="font-bold">Jamia Masjid Nabvi Qureshi Hashmi</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>پیمنٹ کی تفصیلات جمع کرائیں</CardTitle>
                  <CardDescription>
                    براہ کرم اپنی پیمنٹ کی رسید اور دیگر تفصیلات یہاں جمع کرائیں
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentReference">پیمنٹ ریفرنس نمبر</Label>
                      <Input
                        id="paymentReference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="ٹرانزیکشن آئی ڈی یا ریفرنس نمبر درج کریں"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">ادائیگی کی تاریخ</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">ادائیگی کی رقم (PKR)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="1500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receiptUpload">ادائیگی کی رسید اپلوڈ کریں</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        {receiptFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <p className="text-sm font-medium">{receiptFile.name}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setReceiptFile(null)}
                            >
                              تبدیل کریں
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              اپنی رسید کی تصویر یہاں اپلوڈ کریں
                            </p>
                            <Input
                              id="receiptUpload"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="max-w-xs"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">اضافی نوٹس (اختیاری)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="کسی بھی اضافی معلومات کا ذکر کریں"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6"
                      disabled={submitPaymentMutation.isPending}
                    >
                      {submitPaymentMutation.isPending ? "جمع کرایا جا رہا ہے..." : "پیمنٹ جمع کرائیں"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="madrasa">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>مدرسہ فیس کی معلومات</CardTitle>
                  <CardDescription>مختلف کورسز اور تعلیم کے لیے فیس</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>یاد رکھیں</AlertTitle>
                      <AlertDescription>
                        بین الاقوامی طلباء کے لیے فیس کی رقم امریکی ڈالر میں ہے، مقامی طلباء کے لیے روپے میں
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">اکاؤنٹ نمبر:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">0541003765900001</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard("0541003765900001")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">PK31JSBL9999903468053268</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard("PK31JSBL9999903468053268")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">بینک:</span>
                        <span className="font-bold">JS Bank</span>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">اکاؤنٹ ہولڈر:</span>
                        <span className="font-bold">Jamia Masjid Nabvi Qureshi Hashmi</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-semibold text-lg">فیس کی تفصیلات</h3>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border p-3 rounded-md">
                          <p className="font-medium">قاعدہ اور ناظرہ:</p>
                          <p className="text-xl font-bold mt-1">$100 / ماہ</p>
                        </div>
                        
                        <div className="border p-3 rounded-md">
                          <p className="font-medium">حفظ:</p>
                          <p className="text-xl font-bold mt-1">$200 / ماہ</p>
                        </div>
                        
                        <div className="border p-3 rounded-md">
                          <p className="font-medium">بنیادی عربی گرامر:</p>
                          <p className="text-xl font-bold mt-1">$150 / ماہ</p>
                        </div>
                        
                        <div className="border p-3 rounded-md">
                          <p className="font-medium">اصول حدیث:</p>
                          <p className="text-xl font-bold mt-1">$200 / ماہ</p>
                        </div>
                        
                        <div className="border p-3 rounded-md">
                          <p className="font-medium">اصول فقہ:</p>
                          <p className="text-xl font-bold mt-1">$150 / ماہ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>پیمنٹ کی تفصیلات جمع کرائیں</CardTitle>
                  <CardDescription>
                    براہ کرم اپنی پیمنٹ کی رسید اور دیگر تفصیلات یہاں جمع کرائیں
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentReference">پیمنٹ ریفرنس نمبر</Label>
                      <Input
                        id="paymentReference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="ٹرانزیکشن آئی ڈی یا ریفرنس نمبر درج کریں"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">ادائیگی کی تاریخ</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">ادائیگی کی رقم</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="150"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receiptUpload">ادائیگی کی رسید اپلوڈ کریں</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        {receiptFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <p className="text-sm font-medium">{receiptFile.name}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setReceiptFile(null)}
                            >
                              تبدیل کریں
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              اپنی رسید کی تصویر یہاں اپلوڈ کریں
                            </p>
                            <Input
                              id="receiptUpload"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="max-w-xs"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">اضافی نوٹس (اختیاری)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="کسی بھی اضافی معلومات کا ذکر کریں"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6"
                      disabled={submitPaymentMutation.isPending}
                    >
                      {submitPaymentMutation.isPending ? "جمع کرایا جا رہا ہے..." : "پیمنٹ جمع کرائیں"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PaymentPage;