export interface Advice {
  id: number;
  text: string;
}

export interface AdviceData {
  [key: string]: Advice[];  // Language code as key
}

export const advice: AdviceData = {
  en: [
    { id: 1, text: "Start your day with supplications to set a positive tone and seek guidance." },
    { id: 2, text: "Remember that consistency in daily supplications helps build a stronger connection with your faith." },
    { id: 3, text: "Reflect on the meaning of each supplication rather than rushing through them." },
    { id: 4, text: "The morning and evening supplications serve as spiritual protection throughout your day." },
    { id: 5, text: "Teaching children supplications from a young age instills important values and practices." },
    { id: 6, text: "Setting aside a specific time each day for supplications helps establish a beneficial routine." },
    { id: 7, text: "Reciting supplications with sincerity enhances their spiritual impact." },
    { id: 8, text: "Supplications can be a form of mindfulness that helps reduce anxiety and stress." },
    { id: 9, text: "Learning the meaning behind each supplication enriches your spiritual experience." },
    { id: 10, text: "Sharing the practice of daily supplications can strengthen family bonds." }
  ],
  tr: [
    { id: 1, text: "Gününüze olumlu bir ton belirlemek ve rehberlik istemek için gününüze dualarla başlayın." },
    { id: 2, text: "Günlük dualarda tutarlılık, inancınızla daha güçlü bir bağ kurmaya yardımcı olur." },
    { id: 3, text: "Duaları aceleyle okumak yerine her duanın anlamını düşünün." },
    { id: 4, text: "Sabah ve akşam duaları, gün boyunca manevi koruma sağlar." },
    { id: 5, text: "Çocuklara küçük yaştan itibaren dua öğretmek, önemli değerler ve uygulamalar aşılar." },
    { id: 6, text: "Her gün dualar için belirli bir zaman ayırmak, faydalı bir rutin oluşturmaya yardımcı olur." },
    { id: 7, text: "Duaları samimiyetle okumak, onların manevi etkisini artırır." },
    { id: 8, text: "Dualar, kaygı ve stresi azaltmaya yardımcı olan bir farkındalık biçimi olabilir." },
    { id: 9, text: "Her duanın arkasındaki anlamı öğrenmek, manevi deneyiminizi zenginleştirir." },
    { id: 10, text: "Günlük dua pratiğini paylaşmak aile bağlarını güçlendirebilir." }
  ],
  ar: [
    { id: 1, text: "ابدأ يومك بالأذكار لتحديد نغمة إيجابية وطلب التوجيه." },
    { id: 2, text: "تذكر أن الاستمرارية في الأذكار اليومية تساعد على بناء علاقة أقوى مع إيمانك." },
    { id: 3, text: "تأمل في معنى كل ذكر بدلاً من التسرع خلالها." },
    { id: 4, text: "أذكار الصباح والمساء بمثابة حماية روحية طوال يومك." },
    { id: 5, text: "تعليم الأطفال الأذكار من سن مبكرة يغرس القيم والممارسات المهمة." },
    { id: 6, text: "تخصيص وقت محدد كل يوم للأذكار يساعد على إنشاء روتين مفيد." },
    { id: 7, text: "تلاوة الأذكار بإخلاص يعزز تأثيرها الروحي." },
    { id: 8, text: "يمكن أن تكون الأذكار شكلاً من أشكال اليقظة الذهنية التي تساعد على تقليل القلق والتوتر." },
    { id: 9, text: "تعلم المعنى وراء كل ذكر يثري تجربتك الروحية." },
    { id: 10, text: "مشاركة ممارسة الأذكار اليومية يمكن أن تقوي الروابط الأسرية." }
  ]
};
