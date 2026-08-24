export interface CountryCode {
  iso2: string;
  name: string;
  dial: string;
}

// Pays les plus fréquents pour amazingtraders, affichés en tête de liste.
export const PRIORITY_COUNTRY_CODES: readonly string[] = [
  "CI",
  "FR",
  "SN",
  "BJ",
  "TG",
  "ML",
  "BF",
  "CM",
  "CA",
  "BE",
  "CH",
  "MA",
];

export const COUNTRY_CODES: CountryCode[] = [
  { iso2: "AF", name: "Afghanistan", dial: "+93" },
  { iso2: "ZA", name: "Afrique du Sud", dial: "+27" },
  { iso2: "AL", name: "Albanie", dial: "+355" },
  { iso2: "DZ", name: "Algérie", dial: "+213" },
  { iso2: "DE", name: "Allemagne", dial: "+49" },
  { iso2: "AD", name: "Andorre", dial: "+376" },
  { iso2: "AO", name: "Angola", dial: "+244" },
  { iso2: "AG", name: "Antigua-et-Barbuda", dial: "+1268" },
  { iso2: "SA", name: "Arabie saoudite", dial: "+966" },
  { iso2: "AR", name: "Argentine", dial: "+54" },
  { iso2: "AM", name: "Arménie", dial: "+374" },
  { iso2: "AU", name: "Australie", dial: "+61" },
  { iso2: "AT", name: "Autriche", dial: "+43" },
  { iso2: "AZ", name: "Azerbaïdjan", dial: "+994" },
  { iso2: "BS", name: "Bahamas", dial: "+1242" },
  { iso2: "BH", name: "Bahreïn", dial: "+973" },
  { iso2: "BD", name: "Bangladesh", dial: "+880" },
  { iso2: "BB", name: "Barbade", dial: "+1246" },
  { iso2: "BE", name: "Belgique", dial: "+32" },
  { iso2: "BZ", name: "Belize", dial: "+501" },
  { iso2: "BJ", name: "Bénin", dial: "+229" },
  { iso2: "BT", name: "Bhoutan", dial: "+975" },
  { iso2: "BY", name: "Biélorussie", dial: "+375" },
  { iso2: "MM", name: "Birmanie", dial: "+95" },
  { iso2: "BO", name: "Bolivie", dial: "+591" },
  { iso2: "BA", name: "Bosnie-Herzégovine", dial: "+387" },
  { iso2: "BW", name: "Botswana", dial: "+267" },
  { iso2: "BR", name: "Brésil", dial: "+55" },
  { iso2: "BN", name: "Brunei", dial: "+673" },
  { iso2: "BG", name: "Bulgarie", dial: "+359" },
  { iso2: "BF", name: "Burkina Faso", dial: "+226" },
  { iso2: "BI", name: "Burundi", dial: "+257" },
  { iso2: "KH", name: "Cambodge", dial: "+855" },
  { iso2: "CM", name: "Cameroun", dial: "+237" },
  { iso2: "CA", name: "Canada", dial: "+1" },
  { iso2: "CV", name: "Cap-Vert", dial: "+238" },
  { iso2: "CL", name: "Chili", dial: "+56" },
  { iso2: "CN", name: "Chine", dial: "+86" },
  { iso2: "CY", name: "Chypre", dial: "+357" },
  { iso2: "CO", name: "Colombie", dial: "+57" },
  { iso2: "KM", name: "Comores", dial: "+269" },
  { iso2: "CG", name: "Congo-Brazzaville", dial: "+242" },
  { iso2: "CD", name: "Congo (RDC)", dial: "+243" },
  { iso2: "KR", name: "Corée du Sud", dial: "+82" },
  { iso2: "KP", name: "Corée du Nord", dial: "+850" },
  { iso2: "CR", name: "Costa Rica", dial: "+506" },
  { iso2: "CI", name: "Côte d'Ivoire", dial: "+225" },
  { iso2: "HR", name: "Croatie", dial: "+385" },
  { iso2: "CU", name: "Cuba", dial: "+53" },
  { iso2: "DK", name: "Danemark", dial: "+45" },
  { iso2: "DJ", name: "Djibouti", dial: "+253" },
  { iso2: "DO", name: "République dominicaine", dial: "+1809" },
  { iso2: "EG", name: "Égypte", dial: "+20" },
  { iso2: "AE", name: "Émirats arabes unis", dial: "+971" },
  { iso2: "EC", name: "Équateur", dial: "+593" },
  { iso2: "ER", name: "Érythrée", dial: "+291" },
  { iso2: "ES", name: "Espagne", dial: "+34" },
  { iso2: "EE", name: "Estonie", dial: "+372" },
  { iso2: "SZ", name: "Eswatini", dial: "+268" },
  { iso2: "US", name: "États-Unis", dial: "+1" },
  { iso2: "ET", name: "Éthiopie", dial: "+251" },
  { iso2: "FJ", name: "Fidji", dial: "+679" },
  { iso2: "FI", name: "Finlande", dial: "+358" },
  { iso2: "FR", name: "France", dial: "+33" },
  { iso2: "GA", name: "Gabon", dial: "+241" },
  { iso2: "GM", name: "Gambie", dial: "+220" },
  { iso2: "GE", name: "Géorgie", dial: "+995" },
  { iso2: "GH", name: "Ghana", dial: "+233" },
  { iso2: "GR", name: "Grèce", dial: "+30" },
  { iso2: "GD", name: "Grenade", dial: "+1473" },
  { iso2: "GT", name: "Guatemala", dial: "+502" },
  { iso2: "GN", name: "Guinée", dial: "+224" },
  { iso2: "GQ", name: "Guinée équatoriale", dial: "+240" },
  { iso2: "GW", name: "Guinée-Bissau", dial: "+245" },
  { iso2: "GY", name: "Guyana", dial: "+592" },
  { iso2: "HT", name: "Haïti", dial: "+509" },
  { iso2: "HN", name: "Honduras", dial: "+504" },
  { iso2: "HU", name: "Hongrie", dial: "+36" },
  { iso2: "IN", name: "Inde", dial: "+91" },
  { iso2: "ID", name: "Indonésie", dial: "+62" },
  { iso2: "IQ", name: "Irak", dial: "+964" },
  { iso2: "IR", name: "Iran", dial: "+98" },
  { iso2: "IE", name: "Irlande", dial: "+353" },
  { iso2: "IS", name: "Islande", dial: "+354" },
  { iso2: "IL", name: "Israël", dial: "+972" },
  { iso2: "IT", name: "Italie", dial: "+39" },
  { iso2: "JM", name: "Jamaïque", dial: "+1876" },
  { iso2: "JP", name: "Japon", dial: "+81" },
  { iso2: "JO", name: "Jordanie", dial: "+962" },
  { iso2: "KZ", name: "Kazakhstan", dial: "+7" },
  { iso2: "KE", name: "Kenya", dial: "+254" },
  { iso2: "KG", name: "Kirghizistan", dial: "+996" },
  { iso2: "KW", name: "Koweït", dial: "+965" },
  { iso2: "LA", name: "Laos", dial: "+856" },
  { iso2: "LS", name: "Lesotho", dial: "+266" },
  { iso2: "LV", name: "Lettonie", dial: "+371" },
  { iso2: "LB", name: "Liban", dial: "+961" },
  { iso2: "LR", name: "Libéria", dial: "+231" },
  { iso2: "LY", name: "Libye", dial: "+218" },
  { iso2: "LI", name: "Liechtenstein", dial: "+423" },
  { iso2: "LT", name: "Lituanie", dial: "+370" },
  { iso2: "LU", name: "Luxembourg", dial: "+352" },
  { iso2: "MK", name: "Macédoine du Nord", dial: "+389" },
  { iso2: "MG", name: "Madagascar", dial: "+261" },
  { iso2: "MY", name: "Malaisie", dial: "+60" },
  { iso2: "MW", name: "Malawi", dial: "+265" },
  { iso2: "MV", name: "Maldives", dial: "+960" },
  { iso2: "ML", name: "Mali", dial: "+223" },
  { iso2: "MT", name: "Malte", dial: "+356" },
  { iso2: "MA", name: "Maroc", dial: "+212" },
  { iso2: "MU", name: "Maurice", dial: "+230" },
  { iso2: "MR", name: "Mauritanie", dial: "+222" },
  { iso2: "MX", name: "Mexique", dial: "+52" },
  { iso2: "MD", name: "Moldavie", dial: "+373" },
  { iso2: "MC", name: "Monaco", dial: "+377" },
  { iso2: "MN", name: "Mongolie", dial: "+976" },
  { iso2: "ME", name: "Monténégro", dial: "+382" },
  { iso2: "MZ", name: "Mozambique", dial: "+258" },
  { iso2: "NA", name: "Namibie", dial: "+264" },
  { iso2: "NP", name: "Népal", dial: "+977" },
  { iso2: "NI", name: "Nicaragua", dial: "+505" },
  { iso2: "NE", name: "Niger", dial: "+227" },
  { iso2: "NG", name: "Nigeria", dial: "+234" },
  { iso2: "NO", name: "Norvège", dial: "+47" },
  { iso2: "NZ", name: "Nouvelle-Zélande", dial: "+64" },
  { iso2: "OM", name: "Oman", dial: "+968" },
  { iso2: "UG", name: "Ouganda", dial: "+256" },
  { iso2: "UZ", name: "Ouzbékistan", dial: "+998" },
  { iso2: "PK", name: "Pakistan", dial: "+92" },
  { iso2: "PA", name: "Panama", dial: "+507" },
  { iso2: "PG", name: "Papouasie-Nouvelle-Guinée", dial: "+675" },
  { iso2: "PY", name: "Paraguay", dial: "+595" },
  { iso2: "NL", name: "Pays-Bas", dial: "+31" },
  { iso2: "PE", name: "Pérou", dial: "+51" },
  { iso2: "PH", name: "Philippines", dial: "+63" },
  { iso2: "PL", name: "Pologne", dial: "+48" },
  { iso2: "PT", name: "Portugal", dial: "+351" },
  { iso2: "QA", name: "Qatar", dial: "+974" },
  { iso2: "CF", name: "République centrafricaine", dial: "+236" },
  { iso2: "CZ", name: "République tchèque", dial: "+420" },
  { iso2: "RO", name: "Roumanie", dial: "+40" },
  { iso2: "GB", name: "Royaume-Uni", dial: "+44" },
  { iso2: "RU", name: "Russie", dial: "+7" },
  { iso2: "RW", name: "Rwanda", dial: "+250" },
  { iso2: "WS", name: "Samoa", dial: "+685" },
  { iso2: "ST", name: "Sao Tomé-et-Principe", dial: "+239" },
  { iso2: "SN", name: "Sénégal", dial: "+221" },
  { iso2: "RS", name: "Serbie", dial: "+381" },
  { iso2: "SC", name: "Seychelles", dial: "+248" },
  { iso2: "SL", name: "Sierra Leone", dial: "+232" },
  { iso2: "SG", name: "Singapour", dial: "+65" },
  { iso2: "SK", name: "Slovaquie", dial: "+421" },
  { iso2: "SI", name: "Slovénie", dial: "+386" },
  { iso2: "SO", name: "Somalie", dial: "+252" },
  { iso2: "SD", name: "Soudan", dial: "+249" },
  { iso2: "SS", name: "Soudan du Sud", dial: "+211" },
  { iso2: "LK", name: "Sri Lanka", dial: "+94" },
  { iso2: "SE", name: "Suède", dial: "+46" },
  { iso2: "CH", name: "Suisse", dial: "+41" },
  { iso2: "SR", name: "Suriname", dial: "+597" },
  { iso2: "SY", name: "Syrie", dial: "+963" },
  { iso2: "TJ", name: "Tadjikistan", dial: "+992" },
  { iso2: "TZ", name: "Tanzanie", dial: "+255" },
  { iso2: "TD", name: "Tchad", dial: "+235" },
  { iso2: "TH", name: "Thaïlande", dial: "+66" },
  { iso2: "TL", name: "Timor oriental", dial: "+670" },
  { iso2: "TG", name: "Togo", dial: "+228" },
  { iso2: "TO", name: "Tonga", dial: "+676" },
  { iso2: "TT", name: "Trinité-et-Tobago", dial: "+1868" },
  { iso2: "TN", name: "Tunisie", dial: "+216" },
  { iso2: "TM", name: "Turkménistan", dial: "+993" },
  { iso2: "TR", name: "Turquie", dial: "+90" },
  { iso2: "UA", name: "Ukraine", dial: "+380" },
  { iso2: "UY", name: "Uruguay", dial: "+598" },
  { iso2: "VU", name: "Vanuatu", dial: "+678" },
  { iso2: "VE", name: "Venezuela", dial: "+58" },
  { iso2: "VN", name: "Viêt Nam", dial: "+84" },
  { iso2: "YE", name: "Yémen", dial: "+967" },
  { iso2: "ZM", name: "Zambie", dial: "+260" },
  { iso2: "ZW", name: "Zimbabwe", dial: "+263" },
];

export const PRIORITY_COUNTRIES: CountryCode[] = PRIORITY_COUNTRY_CODES.map(
  (iso2) => COUNTRY_CODES.find((c) => c.iso2 === iso2)!
);

export const OTHER_COUNTRIES: CountryCode[] = COUNTRY_CODES.filter(
  (c) => !PRIORITY_COUNTRY_CODES.includes(c.iso2)
);

const DIAL_CODES_BY_LENGTH = [...COUNTRY_CODES]
  .map((c) => c.dial)
  .sort((a, b) => b.length - a.length);

/**
 * Splits a stored "whatsapp_number" value (e.g. "+225 0102030405") back into
 * its dial code and local number, for pre-filling the two-part input.
 */
export function splitWhatsappNumber(value: string | null | undefined): {
  dial: string;
  number: string;
} {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return { dial: "", number: "" };

  const match = DIAL_CODES_BY_LENGTH.find(
    (dial) => trimmed === dial || trimmed.startsWith(`${dial} `) || trimmed.startsWith(dial)
  );
  if (!match) return { dial: "", number: trimmed };

  return { dial: match, number: trimmed.slice(match.length).trim() };
}

export function combineWhatsappNumber(dial: string, number: string): string {
  const trimmedNumber = number.trim();
  if (!dial && !trimmedNumber) return "";
  if (!dial) return trimmedNumber;
  return trimmedNumber ? `${dial} ${trimmedNumber}` : dial;
}
