import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  classe: string;
  dateNaissance: string;
  adresse: string;
  statut: "actif" | "inactif";
  avatar: string;
  parentId?: number;
  parentName?: string;
}

interface ParentOption {
  id: number;
  firstName: string;
  lastName: string;
}

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSave: (student: Omit<Student, "id"> & { id?: number }) => void;
  parents?: ParentOption[];
}

const classes = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C"];

export function StudentForm({
  open,
  onOpenChange,
  student,
  onSave,
  parents = [],
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    classe: "",
    dateNaissance: "",
    adresse: "",
    statut: "actif" as "actif" | "inactif",
    avatar: "",
    parentId: 0,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        nom: student.nom,
        prenom: student.prenom,
        email: student.email,
        telephone: student.telephone,
        classe: student.classe,
        dateNaissance: student.dateNaissance,
        adresse: student.adresse,
        statut: student.statut,
        avatar: student.avatar || "",
        parentId: student.parentId ?? 0,
      });
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        classe: "",
        dateNaissance: "",
        adresse: "",
        statut: "actif",
        avatar: "",
        parentId: parents[0]?.id ?? 0,
      });
    }
  }, [student, open, parents]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: student?.id,
      parentId: formData.parentId || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {student ? "Modifier l'étudiant" : "Ajouter un étudiant"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {student
              ? "Modifiez les informations de l'étudiant ci-dessous."
              : "Remplissez les informations du nouvel étudiant."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl">
                  {formData.prenom?.[0] || ""}
                  {formData.nom?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs px-3"
                onClick={() => document.getElementById("avatar")?.click()}
              >
                Choisir une image
              </Button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-foreground">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="bg-secondary/50 border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-foreground">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="bg-secondary/50 border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary/50 border-border text-foreground"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-foreground">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateNaissance" className="text-foreground">Date de naissance</Label>
              <Input
                id="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classe" className="text-foreground">Classe</Label>
              <Select value={formData.classe} onValueChange={(value) => setFormData({ ...formData, classe: value })}>
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {classes.map((classe) => (
                    <SelectItem key={classe} value={classe} className="text-foreground">
                      {classe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut" className="text-foreground">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value: "actif" | "inactif") => setFormData({ ...formData, statut: value })}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="actif" className="text-foreground">Actif</SelectItem>
                  <SelectItem value="inactif" className="text-foreground">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="parentId" className="text-foreground">Parent</Label>
              <Select
                value={formData.parentId ? formData.parentId.toString() : ""}
                onValueChange={(value) => setFormData({ ...formData, parentId: Number(value) })}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Sélectionner un parent" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id.toString()} className="text-foreground">
                      {parent.firstName} {parent.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="adresse" className="text-foreground">Adresse</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {student ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
