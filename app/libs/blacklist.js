var markets = [
"e8",
"-71885b983a2f80d5e49a92608e37d6cdd4d3c91de8105b78f0aadb4cc79cdf38",
"-882ec7ccfc47d24464517a7614dde0f0e6c08a34e722403b81254a02e6e8cdf9",
"-b582ea92b3ccc303112b8bebe020c502dce24be66d45e6081a2586c05a87ae",
"-c7299c7a01316d0ce8737d1ee2473152ad0f6b6c2db98424f40a7767f66ab6aa",
"-6962308451b4692521a5126f13f1cb129c955f479c2d309d22331e1b1c27d7ad",
"-7e2013eb7623485e97fc33317469d2711b25754b0537f2b326cc95919b95507",
"-87ebaeb72aeb9bc99ee481250edb6712931421caecb4df2f653ab02d9d7dcf16",
"-c0b48a976f40b00ad80a001c61be2a9e128169c387fd984551329ed913522002",
"-e514e4787ebcc915e6382443fa37e1fbff2437f203747262ee41420882a0175b",
"-8ce4f88850eafe26f995399145e0ab995be341b0841155172c6c7b08060c7893",
"-4690fde1d3c6b549b397c7fa44eae5aae5a1253414910141148c7d034f1e3de8",
"-cbd89430618628ccd895178db7723966692a47006982fa9af434cdf7ecae35b9",
"-21e6269e58d46c0361847f6096c12d28727d5f62d34d88e120fc97199139e635",
"-7305d0b2f3c98f2a0474e988af1a5773bf839c81f21e04bd2d8656d7bc11707c",
"-db1b52e8107b4ecd77e578220896d4caa0211bddce108e9d49d811690d877bf5",
"-df8810ff96a885dcacc9444149c2dadff2253710a45efb0f31ad129b35085bc3",
"-7260fc09152e286845dde22b7ff85f282379152455a7e3d174169d91ec8a9012",
"-5a382129a26efd8fd0fd589ec501305a2ff198586ae35f0eecdf6938e3365b35",
"-a2c35bdf3e3be35bfddcc4e6fbfef0b3264d5bb2b56b019024872919c566876d",
"736b2b190a3aeb4be96519052c8076dc22a54d7cdacff8149ec22e6f0daf252",
"-9df7a6eede46365cd80fffff55651f1906546aeff2021814b9193f9b35c00a08",
"-91d505125a9a26bb7312598dd67f469dda193ff44e49dcd7254d83af0218b875",
"-8219cf20d70d50e4e2352a9f2e5b6448d855a5510cd155501f1a8076658891f5",
"-7490cba34eec335befff64b93dee92849d84385bf1bcf265b47cc8a86b851c64",
"-a0785430e5dddd4a806d1a8c92ff8b4289cbe25c4bc447b80e20f30fcaeb98f4",
 "-592143f7b1a8b53a672d75cc48c1a0d0a10e8bb4b420f991ea5677fbe754f9ab",
 "-6829c28a984e03be3e6d6926a6145f1820b6ff40d2e68394848b9279b0221bdf",
 "-690a323b278eced0f355a275c5a4562ecd93d93a9a1edadeea01b251aba88412",
 "-455bfd41a8b1da04e988e7e0f458d5357660055391fc0ebd0ab53324d48086bf",
 "-dfb19cfe96a023298744de718120f7813538788b7c3e7c9ebe881080e63cc78",
 "-7bc4c05603763fb8e75efbbbffc5d8f0a48182faca3ab86c875df2836322d44a",
 "-2c1b1aec3231f2ed8e3f724765701ecb2f4b9a3bead6f3a2db2ffb0cd0484454",
 "-db4a141b0e7cd61f364cf92256016f95667d2b06ce60aaaf7a6f8f050db1decf",
 "-f2622356249318995562812fa9709c7b8081116881a23dd246be21bdcca91b4",
 "-b31b11fe0e9dfe919a0fe25ec62b827ec61f6bbf4b34cb879636e0e2517225fd",
 "-a8ea21c56673cecac98ae58721d7f1aa53d784ec7e75d97e9826531e4da4f21b",
 "-b0358f8df56b9c5da9c20cce38444fa27bf9631076d8ce7198021a1f64d4a8d",
 "-17f80b8db75d1070e2ccb256a7b7c1445cb747a84b22331390c0f3fdb1cb2232",
 "-7f061d6266e42bf8e40533eb5d430d8fafe0e81599f7d69b8334f92ac7c90be8",
 "-17fe84407b58afe0109e0605352edf06296ff99a714675c3c87ecd98cb067326",
 "-79da1d0921c5be743aea6f6911915c337acc2e0a1b04954b1005502edcaf3113",
 "-831cf656e816c4b83322203936d0c58a8e9e60a5564972c64fba612b2c9bb2bf",
 "-3f304dafca7361fe2f3c94ca7d24109979f9f8ea9a399134385bdaea2aca09e6",
 "55148a2c445d269ea5d9fb8e4e383e4095382367f5799d4176e90c76e321456",
 "-ccc8c27497270a6cadc3698f194481949bfd3a740d33e66bf3b15cb27e7243be",
 "-7b876f53e34d701ebee1c0003e696ed35d96d536158149563ca9c39b091e04b4",
 "-a13c99483715ba50588f57a96e961e55d9d91b9a33cf2d10d942d52549a3fca4",
 "-6dfdb1d7e4b1c0af0c3fa888257f9b228a8c97e47de6ce4c15227757793ecdad",
 "-e8c081180c8d585754c38a33b1703b9afc9f43178ec7497f413b6908f80bd697",
 "-6ba75d4a3951fa4b541b621b88a98407d35c3d92ada23f5c5103f6f3b4eb6188",
 "-9d84a6f452ea009d47967ed8a0abfce3647c57cad4a500c7d34934822f823d03",
 "-df518c3186199895ca10b4ac0f5215b81499cdebb03c52f2af9daf838c6417bf",
 "-a694ac407a9ea39e05d7314101829792051757dedfa6e449a4d367e1abcad23a",
 "-85752d2ae852e044863ca6796a929f2ce6d6c49a8335db42688d22320ef9e249",
 "-ba4fb2d6cfaa4b954ed8c972e0d33962ce95955ea0d86c3e13afc37dc657b9fe",
"91543fc497c20765ab1801993e6409a84349b90e8f50c7ebf5e2fff6995efa4",
"-c407cae8cb3ad56eee5473df06e7217d4643e797e3507bd3c43818ee8b9cc808",
"-1f02170dd0065689412bcc3e945611b4c2614e77989c07c86494de9361d628b",
"-4ec26706cc3429fd5c262b9d9d9ff8898754def2e19c4cef74dce3e8a700668f",
"-a1aeb4ad4214c86bee2ee9b032e3916165e22c4784018ba5fcd738f9ca79a08b",
"-e867690f5308065fd1579dfef24a930a3d46a4e06e57d785cd11f39eb09ee30d",
"-26003bd52e2365e949f4b0f0fe9c96d6d8b487a549003303d5c909cbd9fc51e1",
"-5406d802b136703c23e3221a87fd204e94706f61a6d792aa590cfcb416dac39d",
"-443466662bea4d94965ab2e300da3a5edacf59d201845beae7d507b79bf18b57",
"-2a2cdcbdb56c7609e9a7a4ea2455bddb4e4cb39e9dc4b11cdc5859ca526a51da",
"-e0bf01ce61833d61da71ebedfb4f9632b9ee4e72ffe25f942c7358135c6843e",
"-9ba19e9bc97e8c7b2126d69a1074545713c36d14e516ddb27e1cf808c82e7ce0",
"-5e5b103ea46101e1c2ded9c3883d6cb3eb535921fa7865f552d1246d7b490966",
"-94f366c270c28c274787951ffa5ceb6923645f1c6389e083f4751d5c19aeefdb",
"-142fd9776bd75c55f806bce578dcfbbd20766704a122f4e508467c0da48c6e0c",
"-3f8d586356b5f9ec51ff193266883e99cd95cbf6e927d8e1fce5edef91c7a47d",
"80e119c3364d4f21831aece22c644a600aaae7338259f230aecb35ac79ea03c",
"-2bb8bd430f6f1500dfcd73348df17ff8c9ea6768b8e322b4765006564f89b259",
"-65ca0a73de5f59060e2b7d49ed8160eed10c99fa0efa3a8e45ee4123246537bc",
"-1047c878334010dba173fc111873d5f6b45bd5eeb4b0d392d32bc4b649c30b56",
"-a0400b02fdc6bf16a6f173a482fa3a9d01bead8f7fafbae7ad46a5a084e5242a",
"-ad788ebebc74fba27037ed7de3e10d352ec8660f8f5c2d04685e3eb9868bd999",
"a6d51897565c0b66b9b52684c947b46979a392e35c7efe83ef46f66a13e5d51",
"-19bcbf41e24f9eddb2a1672ca5bd46a59ae1e34b1200f08285e0427cd90157cf",
"-15354cd241cb6ce7ee335f5adb35ff95129914e223a429270f09919dd1e38bd",
"-3ea987e046632cd44198a4b52acb712d261bd1635f897f4c9b4ebbd76be746a3",
"-8285cc70484ede1ad8d4155029a048f5058cb8023615e72dea4510ee6e7ba4f9",
"-283fc93dace2fb1c207d8dd8f6342d9062e01bf524158d7dacce39ef8ec92c79",
"-2183765686ee10e22ea30d8f4825d504635cd9d28b860229b73ebe12ff62ccdc",
"-e2ad97c6efe7a1e3d77a7d9e3d439c7acafe27d2d43fe86ad0a03d562c8dc9c2",
"-b17ae38e4e09cea67bab65331e0bde7ada61a75273c918494e984aff368837a0",
"-98ae6cd64ac54893ab8e7ca1f302ed55be8d9f0b9710358efae614dc204c89d",
"-41ba7237e7a24bdbe5ffc24c669c82dbc6a7c5e4efa0312974694b7abaff1e1",
"1e140fc120999210889c952e4172808c6b8fe8052eb2228b75606b0b4c16c03",
"-ce043897deaf3e7557efd593875879aec96a8767e18ce73fb2e32712bb538334",
"-3faffb06a9d7ecf2c312f5d367cc49a68108a5a24c85730e2a8b830b7efbb89",
"-309c9e25fb7f83380f71ab55b4fcf2c00f4f5d96bcb2a13c1a08b3c2de367678",
"-c6336c49115d4cecb3f0030386633375eb1915a316966a24ea815dbabdcb69f",
"-36b8f125e2ee2751e1b00b54bcc4285e70493007b16f7640ac49edc30b3f5060",
"-4b1b3776ae029f9874188b0365d21c1a3c1d69c689562fca092f83e810a55aa8",
"-36bc675228813f14cecd1fa72473acd47d5095edcfed8faba591a5dd9ac25efa"
]

var events = [];

module.exports = {
	markets: markets,
	events: events
}