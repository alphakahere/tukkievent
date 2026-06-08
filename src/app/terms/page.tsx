import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata = {
	title: "Conditions d'utilisation · Tukki Event",
};

export default function TermsPage() {
	return (
		<LegalPageShell
			title="Conditions d'utilisation"
			subtitle="Dernière mise à jour : janvier 2026"
		>
			<LegalSection heading="1. Acceptation des conditions">
				<p>
					En accédant à la plateforme Tukki Event et en l&apos;utilisant,
					vous acceptez sans réserve les présentes conditions
					d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions,
					veuillez ne pas utiliser nos services.
				</p>
			</LegalSection>

			<LegalSection heading="2. Description du service">
				<p>
					Tukki Event est une plateforme de billetterie événementielle qui
					met en relation les organisateurs d&apos;événements et le public.
					Nous permettons l&apos;achat et la vente de billets pour des
					événements en Afrique de l&apos;Ouest, en francs CFA (XOF) et,
					le cas échéant, en euros (EUR).
				</p>
			</LegalSection>

			<LegalSection heading="3. Compte utilisateur">
				<p>
					La création d&apos;un compte peut être nécessaire pour accéder à
					certaines fonctionnalités. Vous êtes responsable de la
					confidentialité de vos identifiants et de toutes les activités
					réalisées depuis votre compte.
				</p>
			</LegalSection>

			<LegalSection heading="4. Achat de billets">
				<p>
					Les billets achetés via Tukki Event sont nominatifs. Le prix
					affiché inclut les frais de service. Une fois la commande
					confirmée et payée, un billet électronique muni d&apos;un QR code
					vous est délivré.
				</p>
			</LegalSection>

			<LegalSection heading="5. Remboursements et annulations">
				<p>
					Les conditions de remboursement sont définies par
					l&apos;organisateur de chaque événement. En cas d&apos;annulation
					d&apos;un événement par l&apos;organisateur, le remboursement est
					traité selon la politique applicable.
				</p>
			</LegalSection>

			<LegalSection heading="6. Responsabilités">
				<p>
					Tukki Event agit en tant qu&apos;intermédiaire technique.
					L&apos;organisateur demeure seul responsable de la tenue, du
					contenu et de la bonne exécution de son événement.
				</p>
			</LegalSection>

			<LegalSection heading="7. Modification des conditions">
				<p>
					Nous nous réservons le droit de modifier les présentes conditions
					à tout moment. Les modifications prennent effet dès leur
					publication sur cette page.
				</p>
			</LegalSection>

			<LegalSection heading="8. Contact">
				<p>
					Pour toute question relative à ces conditions, contactez-nous à
					l&apos;adresse{" "}
					<a
						href="mailto:support@tukkievent.com"
						className="text-primary font-medium hover:underline"
					>
						support@tukkievent.com
					</a>
					.
				</p>
			</LegalSection>
		</LegalPageShell>
	);
}
