import { Mail, Github, Globe, GraduationCap, Instagram, Linkedin } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HomeCommitteeMember } from "../data/types";

interface CommitteeProps {
  title: string;
  subtitle: string;
  members: HomeCommitteeMember[];
}

function resolveImage(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function LinkIcon({ href, label }: { href: string; label: string }) {
  if (!href) return null;

  if (label === "linkedin") return <Linkedin className="h-4 w-4" />;
  if (label === "lattes") return <GraduationCap className="h-4 w-4" />;
  if (label === "github") return <Github className="h-4 w-4" />;
  if (label === "instagram") return <Instagram className="h-4 w-4" />;
  if (label === "site") return <Globe className="h-4 w-4" />;
  if (label === "email") return <Mail className="h-4 w-4" />;
  return null;
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={label === "email" ? `mailto:${href.replace(/^mailto:/, "")}` : href}
      target={label === "email" ? undefined : "_blank"}
      rel={label === "email" ? undefined : "noopener noreferrer"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/70 hover:bg-muted"
      aria-label={label}
      title={label}
    >
      <LinkIcon href={href} label={label} />
    </a>
  );
}

export default function Committee({ title, subtitle, members }: CommitteeProps) {
  if (members.length === 0) return null;

  return (
    <section id="comissao" className="py-14 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <ScrollReveal key={`${member.name}-${index}`} delay={80 + index * 40}>
              <Card className="h-full border-border/70 bg-card/80">
                <CardHeader>
                  <img
                    src={resolveImage(member.photoUrl)}
                    alt={`Foto de ${member.name}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <CardTitle className="mt-3 text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {member.linkedin ? <SocialLink href={member.linkedin} label="linkedin" /> : null}
                  {member.lattes ? <SocialLink href={member.lattes} label="lattes" /> : null}
                  {member.github ? <SocialLink href={member.github} label="github" /> : null}
                  {member.instagram ? <SocialLink href={member.instagram} label="instagram" /> : null}
                  {member.site ? <SocialLink href={member.site} label="site" /> : null}
                  {member.email ? <SocialLink href={member.email} label="email" /> : null}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
