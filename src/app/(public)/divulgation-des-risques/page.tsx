import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function RiskDisclosurePage() {
  return (
    <LegalPageLayout title="Divulgation des risques">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <p className="font-semibold text-destructive">
          LE TRADING NE CONVIENT PAS À TOUT LE MONDE. LES OPÉRATIONS DE CHANGE
          COMPORTENT DES RISQUES ÉLEVÉS ET PEUVENT ENTRAÎNER LA PERTE TOTALE
          DE VOS FONDS !
        </p>
      </div>

      <p>
        Les opérations de change sur marge comportent un{" "}
        <strong>niveau de risque élevé</strong> et peuvent ne pas convenir à
        tous les investisseurs. Avant de décider d&apos;effectuer des
        opérations de change, vous devez examiner attentivement vos objectifs
        d&apos;investissement, votre niveau d&apos;expérience et votre goût
        du risque. Il est possible que vous perdiez tout ou une partie de
        votre investissement initial et vous ne devez donc pas investir de
        l&apos;argent que vous ne pouvez pas vous permettre de perdre !
      </p>
      <p>
        Le niveau élevé de l&apos;effet de levier associé à la négociation de
        devises signifie que le degré de risque est plus élevé par rapport à
        d&apos;autres produits financiers. L&apos;effet de levier (ou le
        trading sur marge) peut se retourner contre vous et entraîner des
        pertes substantielles. Toute opération de change hors bourse comporte
        des risques considérables, notamment en ce qui concerne l&apos;effet
        de levier, la solvabilité, la protection réglementaire limitée et la
        volatilité du marché qui peut affecter de manière substantielle le
        prix ou la liquidité d&apos;une devise ou d&apos;une paire de
        devises. Vous devez être conscient de tous les risques associés aux
        opérations de change et demander l&apos;avis d&apos;un conseiller
        financier indépendant si vous avez des doutes.
      </p>

      <h2>Avis de marché</h2>
      <p>
        AmazingTraders n&apos;acceptera aucune responsabilité pour toute
        perte ou dommage, y compris, sans s&apos;y limiter, toute perte de
        profit, qui pourrait résulter directement ou indirectement de
        l&apos;utilisation de ces informations ou de la confiance qu&apos;elles
        suscitent. Vous êtes entièrement responsable des décisions
        d&apos;investissement que vous prenez. Ces décisions doivent être
        fondées uniquement sur l&apos;évaluation de votre situation
        financière, de vos objectifs d&apos;investissement, de votre
        tolérance au risque et de vos besoins de liquidité.
      </p>

      <h2>Risques liés au trading sur Internet</h2>
      <p>
        Il existe des risques liés à l&apos;utilisation d&apos;un système de
        trading basé sur l&apos;exécution de transactions sur Internet, y
        compris, mais sans s&apos;y limiter, la défaillance du matériel, des
        logiciels et de la connexion Internet. Étant donné que AmazingTraders
        ne contrôle pas la puissance du signal, sa réception ou son
        acheminement via Internet, la configuration de votre équipement ou la
        fiabilité de sa connexion, nous ne pouvons être tenus responsables
        des défaillances de communication, des distorsions ou des retards
        lors des transactions via Internet.
      </p>

      <h2>Utilisation</h2>
      <p>
        Le contenu de ce site ne doit pas être interprété comme des
        conseils, une recommandation ou un moyen d&apos;incitation quelconque
        à acheter ou vendre des instruments financiers ou à s&apos;engager
        dans une quelconque activité d&apos;investissement. Les investisseurs
        prennent leurs propres décisions de manière indépendante.
      </p>
      <p>
        Ce site n&apos;est pas destiné à être distribué ou utilisé par une
        personne dans un pays où une telle distribution ou utilisation
        serait contraire à la législation ou à la réglementation locale.
        Aucun des services ou investissements mentionnés sur ce site
        n&apos;est disponible pour les personnes résidant dans un pays où la
        fourniture de tels services ou investissements serait contraire à la
        législation ou à la réglementation locale. Il incombe aux visiteurs
        de ce site de vérifier les conditions de toute loi ou réglementation
        locale à laquelle ils sont soumis et de s&apos;y conformer.
      </p>

      <p>
        Veuillez également lire nos{" "}
        <a href="/termes-et-conditions">Termes et conditions</a>.
      </p>
    </LegalPageLayout>
  );
}
