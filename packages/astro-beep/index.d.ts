import { AstroIntegration } from 'astro';

export interface AstroBeepProps {
	mode?: "normal" | "blastoff";
}

export default function beep(props: AstroBeepProps): AstroIntegration;
