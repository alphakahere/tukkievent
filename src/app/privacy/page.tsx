import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata = {
	title: "Politique de confidentialité · Tukki Event",
};

export default function PrivacyPage() {
	return (
		<LegalPageShell
			title="Confidentialité"
			subtitle="Dernière mise à jour : janvier 2026"
		>
			<LegalSection heading="1. Données que nous collectons">
				<p>
					Nous collectons les informations que vous nous fournissez
					directement : nom, prénom, adresse e-mail, numéro de téléphone,
					ainsi que les informations nécessaires au traitement de vos
					commandes de billets.
				</p>
			</LegalSection>

			<LegalSection heading="2. Utilisation des données">
				<p>Vos données sont utilisées pour :</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>traiter vos commandes et émettre vos billets ;</li>
					<li>vous envoyer des confirmations et des rappels d&apos;événements ;</li>
					<li>assurer le support client ;</li>
					<li>améliorer nos services.</li>
				</ul>
			</LegalSection>

			<LegalSection heading="3. Partage des données">
				<p>
					Vos données peuvent être partagées avec l&apos;organisateur de
					l&apos;événement pour lequel vous avez acheté un billet, ainsi
					qu&apos;avec nos prestataires de paiement, dans la stricte mesure
					nécessaire au service.
				</p>
			</LegalSection>

			<LegalSection heading="4. Sécurité">
				<p>
					Nous mettons en œuvre des mesures techniques et
					organisationnelles appropriées pour protéger vos données contre
					tout accès, modification ou divulgation non autorisés.
				</p>
			</LegalSection>

			<LegalSection heading="5. Vos droits">
				<p>
					Vous disposez d&apos;un droit d&apos;accès, de rectification et de
					suppression de vos données. Vous pouvez supprimer votre compte à
					tout moment depuis vos paramètres, ce qui entraîne
					l&apos;effacement de vos données personnelles.
				</p>
			</LegalSection>

			<LegalSection heading="6. Cookies">
				<p>
					Nous utilisons des cookies et technologies similaires pour
					assurer le bon fonctionnement de la plateforme et mémoriser vos
					préférences.
				</p>
			</LegalSection>

			<LegalSection heading="7. Contact">
				<p>
					Pour exercer vos droits ou pour toute question relative à vos
					données, contactez-nous à{" "}
					<a
						href="mailto:privacy@tukkievent.com"
						className="text-primary font-medium hover:underline"
					>
						privacy@tukkievent.com
					</a>
					.
				</p>
			</LegalSection>
		</LegalPageShell>
	);
}
