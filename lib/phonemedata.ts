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
phonemeVowelConverter.set("UH", "uu"); // book
phonemeVowelConverter.set("UX", "oo");

phonemeVowelConverter.set("AA", "aa");
phonemeVowelConverter.set("AW", "aw");
phonemeVowelConverter.set("ER", "er");
phonemeVowelConverter.set("AY", "ay");
phonemeVowelConverter.set("EH", "eh");
phonemeVowelConverter.set("EY", "ey");
phonemeVowelConverter.set("IH", "ih");
phonemeVowelConverter.set("UW", "uw");

export const phonemeContextInfo = new Map<string, string>();
// vowels
phonemeContextInfo.set("ah", "middle of 'bAt'");
phonemeContextInfo.set("uh", "middle of 'gUt''");
phonemeContextInfo.set("aoh", "middle of 'bOt'");
phonemeContextInfo.set("ae", "a in 'About'");
phonemeContextInfo.set("ih", "i in 'rabbIt'");
phonemeContextInfo.set("oh", "middle of 'bOAt'");
phonemeContextInfo.set("oy", "as in 'bOY'");
phonemeContextInfo.set("uu", "middle of 'bOOk'");
phonemeContextInfo.set("oo", "as in 'dUde'");

phonemeContextInfo.set("aa", "a in 'pAlm'");
phonemeContextInfo.set("aw", "first half of 'OUt'");
phonemeContextInfo.set("er", "middle of 'bIRd'");
phonemeContextInfo.set("ay", "middle of 'bIte'");
phonemeContextInfo.set("eh", "middle of 'pEt'");
phonemeContextInfo.set("ey", "middle of 'wAIt'");
phonemeContextInfo.set("ih", "middle of 'bIt'");
phonemeContextInfo.set("uw", "middle of 'bOOt'");
