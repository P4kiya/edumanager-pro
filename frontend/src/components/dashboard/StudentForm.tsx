import { useState, useEffect } from "react";
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

export interface Student {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  classe: string;
  dateNaissance: string;
  adresse: string;
  statut: "actif" | "inactif";
  avatar: string;
}

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSave: (student: Omit<Student, "id" | "avatar"> & { id?: string }) => void;
}

const classes = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C"];

export function StudentForm({ open, onOpenChange, student, onSave }: StudentFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    classe: "",
    dateNaissance: "",
    adresse: "",
    statut: "actif" as "actif" | "inactif",
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
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: student?.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
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

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classe" className="text-foreground">Classe</Label>
              <Select
                value={formData.classe}
                onValueChange={(value) => setFormData({ ...formData, classe: value })}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {classes.map((c) => (
                    <SelectItem key={c} value={c} className="text-foreground">
                      {c}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse" className="text-foreground">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="bg-secondary/50 border-border text-foreground"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-secondary"
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {student ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
