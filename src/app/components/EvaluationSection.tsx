import { useState, useEffect } from 'react';
import { DollarSign, Upload, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface EvaluationSectionProps {
  language: 'en' | 'th';
}

interface EvaluationData {
  category: string;
  brand: string;
  itemName: string;
  version: string;
  requestAmount: string;
  damageLevel: string;
  photos: File[];
  gptPrompt: string;
  estimatedValue: number;
}

interface GoldPrice {
  buy: number;
  sell: number;
  timestamp: string;
}

export function EvaluationSection({ language }: EvaluationSectionProps) {
  const [formData, setFormData] = useState<EvaluationData>({
    category: '',
    brand: '',
    itemName: '',
    version: '',
    requestAmount: '',
    damageLevel: '',
    photos: [],
    gptPrompt: '',
    estimatedValue: 0,
  });

  const [showPrompt, setShowPrompt] = useState(false);
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);

  // Fetch real-time gold price (mock API - replace with actual API)
useEffect(() => {
  const fetchGoldPrice = async () => {
    try {
      const res = await fetch("https://moneybag-api.vercel.app/api/gold");
      const data = await res.json();

      setGoldPrice({
        buy: data.buy,
        sell: data.sell,
        timestamp: data.timestamp,
      });
    } catch (error) {
      console.error("Failed to fetch gold price:", error);
    }
  };

  fetchGoldPrice();

  // refresh every 5 minutes
  const interval = setInterval(fetchGoldPrice, 300000);

  return () => clearInterval(interval);
}, []);

  const t = {
    en: {
      title: 'AI Asset Valuation & Quotation',
      subtitle: 'Get instant AI-powered evaluation with real-time pricing',
      goldPrice: 'Real-time Gold Price',
      goldBuy: 'Buy',
      goldSell: 'Sell',
      perGram: 'per gram',
      category: 'Category',
      categoryPlaceholder: 'Select category',
      categories: ['Gold', 'Watches', 'Mobile Phones', 'Electronics', 'Jewelry', 'Luxury Items', 'Other'],
      brand: 'Brand',
      itemName: 'Item Name',
      version: 'Model/Version',
      requestAmount: 'Requested Loan Amount',
      damageLevel: 'Condition',
      damageLevels: ['Mint', 'Excellent', 'Good', 'Fair', 'Poor'],
      photos: 'Upload Photos (Minimum 4 required)',
      photosDesc: 'Upload clear photos from different angles',
      generateValuation: 'Generate AI Valuation & Quotation',
      gptPrompt: 'AI Analysis & Quotation',
      copyPrompt: 'Copy Prompt',
      saveQuotation: 'Save Quotation for In-Store Use',
      success: 'Quotation saved successfully!',
      quotationSaved: 'You can present this quotation at our store.',
      photoRequired: 'Please upload at least 4 photos',
      allFieldsRequired: 'Please fill in all required fields',
      promptCopied: 'Prompt copied to clipboard!',
      estimatedValue: 'Estimated Market Value',
      loanOffer: 'Recommended Loan Offer (70% of market value)',
    },
    th: {
      title: 'ประเมินราคาและขอใบเสนอราคา',
      subtitle: 'รับการประเมินทันทีด้วย AI พร้อมราคาทองคำแบบเรียลไทม์',
      goldPrice: 'ราคาทองคำวันนี้',
      goldBuy: 'รับซื้อ',
      goldSell: 'ขาย',
      perGram: 'ต่อกรัม',
      category: 'หมวดหมู่',
      categoryPlaceholder: 'เลือกหมวดหมู่',
      categories: ['ทองคำ', 'นาฬิกา', 'มือถือ', 'อิเล็กทรอนิกส์', 'เครื่องประดับ', 'สินค้าหรู', 'อื่นๆ'],
      brand: 'ยี่ห้อ',
      itemName: 'ชื่อสินค้า',
      version: 'รุ่น/เวอร์ชัน',
      requestAmount: 'จำนวนเงินที่ต้องการกู้',
      damageLevel: 'สภาพสินค้า',
      damageLevels: ['ใหม่มาก', 'ดีเยี่ยม', 'ดี', 'พอใช้', 'แย่'],
      photos: 'อัพโหลดรูปภาพ (ต้องอย่างน้อย 4 รูป)',
      photosDesc: 'อัพโหลดรูปที่ชัดเจนจากหลายมุม',
      generateValuation: 'สร้างการประเมินและใบเสนอราคา',
      gptPrompt: 'ผลการวิเคราะห์และใบเสนอราคา',
      copyPrompt: 'คัดลอก',
      saveQuotation: 'บันทึกใบเสนอราคาเพื่อใช้ที่หน้าร้าน',
      success: 'บันทึกใบเสนอราคาสำเร็จ!',
      quotationSaved: 'คุณสามารถนำใบเสนอราคานี้ไปใช้ที่หน้าร้านได้',
      photoRequired: 'กรุณาอัพโหลดรูปภาพอย่างน้อย 4 รูป',
      allFieldsRequired: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
      promptCopied: 'คัดลอกแล้ว!',
      estimatedValue: 'ราคาประเมิน',
      loanOffer: 'ยอดเงินกู้แนะนำ (70% ของราคาประเมิน)',
    },
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const calculateEstimatedValue = () => {
    let baseValue = 0;

    // Calculate based on category
    if (formData.category === 'Gold' || formData.category === 'ทองคำ') {
      // Use real-time gold price
      if (goldPrice) {
        // Assume 1 baht of gold (15.244 grams)
        baseValue = goldPrice.buy * 15.244;
      }
    } else {
      // For other items, use requested amount as base
      baseValue = parseFloat(formData.requestAmount) * 1.5;
    }

    // Adjust based on condition
    const conditionMultipliers: { [key: string]: number } = {
      'Mint': 1.0, 'ใหม่มาก': 1.0,
      'Excellent': 0.9, 'ดีเยี่ยม': 0.9,
      'Good': 0.75, 'ดี': 0.75,
      'Fair': 0.6, 'พอใช้': 0.6,
      'Poor': 0.4, 'แย่': 0.4,
    };

    const multiplier = conditionMultipliers[formData.damageLevel] || 0.7;
    return Math.round(baseValue * multiplier);
  };

  const generateGPTPrompt = () => {
    if (!formData.category || !formData.brand || !formData.itemName || !formData.version || !formData.requestAmount || !formData.damageLevel) {
      toast.error(t[language].allFieldsRequired);
      return;
    }

    if (formData.photos.length < 4) {
      toast.error(t[language].photoRequired);
      return;
    }

    const estimatedValue = calculateEstimatedValue();
    const loanOffer = Math.round(estimatedValue * 0.7);

    // Generate AI prompt with real-time gold price context
    const prompt = `You are an expert pawn shop valuator for Money bag. Analyze this item and provide a detailed valuation.

REAL-TIME MARKET DATA:
${formData.category === 'Gold' || formData.category === 'ทองคำ' ? `- Gold Price: ${goldPrice?.buy} THB/gram (Buy) | ${goldPrice?.sell} THB/gram (Sell)` : ''}

ITEM DETAILS:
- Category: ${formData.category}
- Brand: ${formData.brand}
- Item Name: ${formData.itemName}
- Model/Version: ${formData.version}
- Condition: ${formData.damageLevel}
- Customer Requested Amount: ${formData.requestAmount} THB
- Photos Provided: ${formData.photos.length}

PRELIMINARY AI ASSESSMENT:
- Estimated Market Value: ${estimatedValue.toLocaleString()} THB
- Recommended Loan Offer: ${loanOffer.toLocaleString()} THB (70% of market value)

Please provide detailed analysis including:
1. Market value verification based on current market conditions
2. Condition assessment and impact on value
3. Key factors affecting valuation
4. Risk assessment for loan approval
5. Recommendations for loan amount and interest rate (max 15% per year)

Format response in JSON:
{
  "marketValue": ${estimatedValue},
  "recommendedLoanOffer": ${loanOffer},
  "conditionScore": <1-10>,
  "valuationFactors": ["factor1", "factor2"],
  "riskLevel": "low|medium|high",
  "interestRate": <percentage>,
  "notes": "detailed analysis"
}`;

    setFormData({ 
      ...formData, 
      gptPrompt: prompt,
      estimatedValue: estimatedValue 
    });
    setShowPrompt(true);

    // Save quotation to localStorage
    const quotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    quotations.push({
      ...formData,
      gptPrompt: prompt,
      estimatedValue: estimatedValue,
      loanOffer: loanOffer,
      goldPrice: goldPrice,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      status: 'pending',
    });
    localStorage.setItem('quotations', JSON.stringify(quotations));

    toast.success(t[language].success);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(formData.gptPrompt);
    toast.success(t[language].promptCopied);
  };

  const saveQuotation = () => {
    toast.success(t[language].quotationSaved);
  };

  return (
    <section id="evaluation" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <DollarSign className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        {/* Real-time Gold Price Display */}
        {goldPrice && (
          <Alert className="mb-8 bg-[#F59E0B]/10 border-[#F59E0B]">
            <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
            <AlertDescription className="font-['Inter']">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0A1F44]">{t[language].goldPrice}:</span>
                <div className="flex space-x-6">
                  <span className="text-[#F59E0B]">
                    {t[language].goldBuy}: <strong>{goldPrice.buy.toLocaleString()} THB</strong> {t[language].perGram}
                  </span>
                  <span className="text-[#10B981]">
                    {t[language].goldSell}: <strong>{goldPrice.sell.toLocaleString()} THB</strong> {t[language].perGram}
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-[#F3F4F6] rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category">{t[language].category} *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-2 bg-white font-['Inter']">
                  <SelectValue placeholder={t[language].categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {t[language].categories.map((cat, idx) => (
                    <SelectItem key={idx} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand and Item Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="brand">{t[language].brand} *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                  className="mt-2 bg-white font-['Inter']"
                />
              </div>
              <div>
                <Label htmlFor="itemName">{t[language].itemName} *</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                  className="mt-2 bg-white font-['Inter']"
                />
              </div>
            </div>

            {/* Version and Request Amount */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="version">{t[language].version} *</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  required
                  className="mt-2 bg-white font-['Inter']"
                />
              </div>
              <div>
                <Label htmlFor="requestAmount">{t[language].requestAmount} *</Label>
                <Input
                  id="requestAmount"
                  type="number"
                  value={formData.requestAmount}
                  onChange={(e) => setFormData({ ...formData, requestAmount: e.target.value })}
                  required
                  className="mt-2 bg-white font-['Inter']"
                />
              </div>
            </div>

            {/* Damage Level */}
            <div>
              <Label htmlFor="damageLevel">{t[language].damageLevel} *</Label>
              <Select value={formData.damageLevel} onValueChange={(value) => setFormData({ ...formData, damageLevel: value })}>
                <SelectTrigger className="mt-2 bg-white font-['Inter']">
                  <SelectValue placeholder={t[language].damageLevel} />
                </SelectTrigger>
                <SelectContent>
                  {t[language].damageLevels.map((level, idx) => (
                    <SelectItem key={idx} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Upload */}
            <div>
              <Label>{t[language].photos} *</Label>
              <p className="text-sm text-gray-500 mt-1 font-['Inter']">{t[language].photosDesc}</p>
              <div className="mt-3">
                <label
                  htmlFor="photos"
                  className="flex items-center justify-center w-full h-40 border-2 border-dashed border-[#10B981] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-[#10B981] mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-['Inter']">
                      {formData.photos.length > 0
                        ? `${formData.photos.length} ${language === 'en' ? 'photos uploaded' : 'รูปที่อัพโหลด'}`
                        : language === 'en'
                        ? 'Click to upload photos'
                        : 'คลิกเพื่ออัพโหลดรูปภาพ'}
                    </p>
                  </div>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateGPTPrompt}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white py-6 font-['Inter']"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              {t[language].generateValuation}
            </Button>

            {/* GPT Prompt Display */}
            {showPrompt && formData.gptPrompt && (
              <div className="mt-8 p-6 bg-white rounded-lg border-2 border-[#10B981]">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-[#0A1F44] font-['Montserrat']">{t[language].gptPrompt}</Label>
                  <Button onClick={copyPrompt} variant="outline" size="sm" className="font-['Inter']">
                    {t[language].copyPrompt}
                  </Button>
                </div>
                <Textarea
                  value={formData.gptPrompt}
                  readOnly
                  rows={15}
                  className="bg-gray-50 font-mono text-sm font-['Inter']"
                />
              </div>
            )}

            {/* Save Quotation Button */}
            {showPrompt && (
              <Button
                onClick={saveQuotation}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-6 font-['Inter'] mt-4"
              >
                {t[language].saveQuotation}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}