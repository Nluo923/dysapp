/*
a	AA	    ɑ	balm,       AA   ɑ | ɒ ɑ:   英 [bɑ:m]     美 [bɑm]        B AA1 M       bot                         英 [bɒt]      美 [bɑt]        B AA1 T
@	AE	    æ	bat         AE   æ          英 [bæt]      美 [bæt]        B AE1 T
A	AH	    ʌ	butt        AH   ʌ          英 [bʌt]      美 [bʌt]        B AH1 T
c	AO	    ɔ	bought      AO   ɔ | ɔ:     英 [bɔ:t]     美 [bɔt]        B AO1 T
W	AW	    aʊ	bout        AW   aʊ         英 [baʊt]     美 [baʊt]       B AW1 T
x	AX	    ə	about       AX   ə          英 [əˈbaʊt]   美 [əˈbaʊt]     AH0 B AW1 T
N/A	AXR[4]	ɚ   letter      ER   ɚ          英 [ˈletə(r)] 美 [ˈlɛtɚ]      L EH1 T ER0
Y	AY	    aɪ	bite        AY   aɪ         英 [baɪt]     美 [baɪt]       B AY1 T
E	EH	    ɛ	bet         EH   ɛ | e      英 [bet]      美 [bet]        B EH1 T
R	ER	    ɝ	bird        ER   ɜr | ɜ:    英 [bɜ:d]     美 [bɜrd]       B ER1 D
e	EY	    eɪ	bait        EY   eɪ         英 [beɪt]     美 [beɪt]       B EH1 T
I	IH	    ɪ	bit         IH   ɪ          英 [bɪt]      美 [bɪt         B IH1 T
X	IX	    ɨ	roses       IX   ɨ          英 ['rəʊzɪz]  美 ['roʊzɪz]    R OW1 Z     rabbit                      英 [ˈræbɪt]   美 [ˈræbɪt]     R AE1 B AH0 T
i	IY	    i	beat        IY   i | i:     英 [bi:t]     美 [bit]        B IY1 T
o	OW	    oʊ	boat        OW   oʊ | əʊ    英 [bəʊt]     美 [boʊt]       B OW1 T
O	OY	    ɔɪ	boy         OY   ɔɪ         英 [bɔɪ]      美 [bɔɪ]        B OY1
U	UH	    ʊ	book        UH   ʊ          英 [bʊk]      美 [bʊk]        B UH1 K
u	UW	    u	boot        UW   u | u:     英 [bu:t]     美 [but]        B UW1 T
N/A	UX[4]	ʉ	dude        UW   ʉ          英 [du:d]     美 [dud, djud]  D UW1 D
*/
export const phonemeVowelConverter = new Map<string, string>();
phonemeVowelConverter.set("AE", "ah"); // bat  ->  ba ah t
phonemeVowelConverter.set("AH", "uh"); // butt, gut  ->  g uh t
phonemeVowelConverter.set("AO", "aoh"); //
phonemeVowelConverter.set("AX", "ae"); // about  ->  uh bout
phonemeVowelConverter.set("IX", "ih"); // rabbit  ->  rabb ih t
phonemeVowelConverter.set("OW", "oh"); // boat  ->   b oh t
phonemeVowelConverter.set("OY", "oy");
phonemeVowelConverter.set("UH", "ou"); // book
phonemeVowelConverter.set("UX", "oo");

phonemeVowelConverter.set("AA", "aa");
phonemeVowelConverter.set("AW", "aw");
phonemeVowelConverter.set("ER", "er");
phonemeVowelConverter.set("AY", "ay");
phonemeVowelConverter.set("EH", "eh");
phonemeVowelConverter.set("EY", "ey");
phonemeVowelConverter.set("IH", "ih");
phonemeVowelConverter.set("UW", "oo");

// merriam webster
export const merriamPhoneticConverter = new Map<string, string>();

merriamPhoneticConverter.set("a", "ah"); // bat  ->  ba ah t
merriamPhoneticConverter.set("ə", "uh"),
  /* butt, gut  ->  g uh t */ merriamPhoneticConverter.set("ᵊ", "uh"); // same schwa
merriamPhoneticConverter.set("ȯ", "aoh"); //
merriamPhoneticConverter.set("i", "ih"); // rabbit  ->  rabb ih t
merriamPhoneticConverter.set("ō", "oh"); // boat  ->   b oh t
merriamPhoneticConverter.set("ȯi", "oy");
merriamPhoneticConverter.set("u̇", "ou"); // book
// merriamPhoneticConverter.set("UX", "oo"); deprecated

merriamPhoneticConverter.set("ä", "aa");
merriamPhoneticConverter.set("au̇", "aw");
merriamPhoneticConverter.set("ər", "er");
merriamPhoneticConverter.set("ī", "ay");
merriamPhoneticConverter.set("e", "eh");
merriamPhoneticConverter.set("ā", "ey");
merriamPhoneticConverter.set("i", "ih");
merriamPhoneticConverter.set("ü", "oo");

// not a vowel but eh
merriamPhoneticConverter.set("ŋ", "ng");

export function merriamConvert(wordI: string) {
  let word = wordI
    .replaceAll(/\//g, "")
    .replaceAll("ː", "")
    .replaceAll(" ͡", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("\u02cc", "")
    .replaceAll("\u02c8", "")
    .replaceAll("\u0252", "\u0251")
    .replaceAll("\u035F", "")
    .replaceAll("m̩", "m")
    .replaceAll(".", "")
    .replaceAll("-", "")
    .replaceAll("÷", "")
    .toLowerCase();

  let outWord: string[] = [];

  // try to find 2 long sequences first
  for (let i = 0; i < word.length; i++) {
    if (
      i < word.length - 1 &&
      merriamPhoneticConverter.get(word.substring(i, i + 2))
    ) {
      // abcdefg, replace cd for 72, abcdefg -> ad72efg
      outWord.push(
        merriamPhoneticConverter.get(word.substring(i, i + 2)) ??
          word.substring(i, i + 2)
      );
      i++;
    } else if (merriamPhoneticConverter.get(word.substring(i, i + 1))) {
      outWord.push(
        merriamPhoneticConverter.get(word.substring(i, i + 1)) ??
          word.substring(i, i + 1)
      );
    } else {
      outWord.push(word.substring(i, i + 1));
    }
  }

  return outWord;
}

export const phonemeContextInfo = new Map<string, string>();
// vowels
phonemeContextInfo.set("ah", "as in 'bAt'");
phonemeContextInfo.set("uh", "as in 'gUt''");
phonemeContextInfo.set("aoh", "as in bOUGHt'");
phonemeContextInfo.set("ih", "i in 'rabbIt'");
phonemeContextInfo.set("oh", "as in 'bOAt'");
phonemeContextInfo.set("oy", "as in 'bOY'");
phonemeContextInfo.set("ou", "as in 'bOOk'");
phonemeContextInfo.set("oo", "as in 'dUde'");

phonemeContextInfo.set("aa", "a in 'pAlm'");
phonemeContextInfo.set("aw", "first half of 'OUt'");
phonemeContextInfo.set("er", "as in 'bIRd'");
phonemeContextInfo.set("ay", "as in 'bIte'");
phonemeContextInfo.set("eh", "as in 'pEt'");
phonemeContextInfo.set("ey", "as in 'wAIt'");
phonemeContextInfo.set("ih", "as in 'bIt'");
