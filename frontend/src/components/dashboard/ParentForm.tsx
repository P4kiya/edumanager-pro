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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Search, UserPlus } from "lucide-react";
import { ObjectifBaseStudentsData } from "@/data/mockStudents";

export interface Parent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar: string;
  soldeDu: number;
  adresse?: string;
  profession?: string;
  cin?: string;
  nationalite?: string;
  dateNaissance?: string;
  genre?: "homme" | "femme" | "";
  situation?: "marié" | "célibataire" | "divorcé" | "veuf" | "";
  childrenIds: number[];
}

interface ParentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent?: Parent | null;
  onSave: (parent: Omit<Parent, "id"> & { id?: number }) => void;
  hideChildrenSelection?: boolean;
}

export function ParentForm({
  open,
  onOpenChange,
  parent,
  onSave,
  hideChildrenSelection = false,
}: ParentFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    avatar: "",
    soldeDu: 0,
    adresse: "",
    profession: "",
    cin: "",
    nationalite: "Marocaine",
    dateNaissance: "",
    genre: "" as "homme" | "femme" | "",
    situation: "" as "marié" | "célibataire" | "divorcé" | "veuf" | "",
    childrenIds: [] as number[],
  });
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (parent) {
      setFormData({
        nom: parent.nom,
        prenom: parent.prenom,
        email: parent.email,
        telephone: parent.telephone,
        avatar: parent.avatar || "",
        soldeDu: parent.soldeDu || 0,
        adresse: parent.adresse || "",
        profession: parent.profession || "",
        cin: parent.cin || "",
        nationalite: parent.nationalite || "Marocaine",
        dateNaissance: parent.dateNaissance || "",
        genre: parent.genre || "",
        situation: parent.situation || "",
        childrenIds: parent.childrenIds || [],
      });
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        avatar: "",
        soldeDu: 0,
        adresse: "",
        profession: "",
        cin: "",
        nationalite: "Marocaine",
        dateNaissance: "",
        genre: "",
        situation: "",
        childrenIds: [],
      });
    }
    setStudentSearch("");
  }, [parent, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleChild = (studentId: number) => {
    setFormData((prev) => ({
      ...prev,
      childrenIds: prev.childrenIds.includes(studentId)
        ? prev.childrenIds.filter((id) => id !== studentId)
        : [...prev.childrenIds, studentId],
    }));
  };

  const removeChild = (studentId: number) => {
    setFormData((prev) => ({
      ...prev,
      childrenIds: prev.childrenIds.filter((id) => id !== studentId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: parent?.id,
    });
    onOpenChange(false);
  };

  const filteredStudents = ObjectifBaseStudentsData.filter((s) => {
    const name = `${s.prenom} ${s.nom}`.toLowerCase();
    return (
      name.includes(studentSearch.toLowerCase()) &&
      !formData.childrenIds.includes(Number(s.id))
    );
  });

  const selectedStudents = ObjectifBaseStudentsData.filter((s) =>
    formData.childrenIds.includes(Number(s.id))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {parent ? "Modifier le parent" : "Ajouter un parent"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {parent
              ? "Modifiez les informations du parent ci-dessous."
              : "Remplissez les informations du nouveau parent."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Avatar + Name row */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl">
                  {formData.prenom?.[0] || ""}{formData.nom?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <Input
                id="avatar-parent"
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
                onClick={() => document.getElementById("avatar-parent")?.click()}
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

          {/* Other fields — 2-column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-foreground">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="06 XX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cin" className="text-foreground">CIN</Label>
              <Input
                id="cin"
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="AB123456"
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalite" className="text-foreground">Nationalité</Label>
              <Input
                id="nationalite"
                value={formData.nationalite}
                onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="Marocaine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-foreground">Genre</Label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value as "homme" | "femme" | "" })}
                className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="">Sélectionner...</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="situation" className="text-foreground">Situation familiale</Label>
              <select
                id="situation"
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value as "marié" | "célibataire" | "divorcé" | "veuf" | "" })}
                className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="">Sélectionner...</option>
                <option value="marié">Marié(e)</option>
                <option value="célibataire">Célibataire</option>
                <option value="divorcé">Divorcé(e)</option>
                <option value="veuf">Veuf / Veuve</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-foreground">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="bg-secondary/50 border-border text-foreground"
              />
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
          </div>

          {/* Children / Students relation */}
          {!hideChildrenSelection && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <Label className="text-foreground font-medium">Enfants inscrits</Label>
            </div>

            {/* Selected children chips */}
            {selectedStudents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((s) => (
                  <Badge
                    key={s.id}
                    className="flex items-center gap-1.5 pr-1 bg-primary/15 text-primary border border-primary/25"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback className="text-[8px]">{s.prenom[0]}</AvatarFallback>
                    </Avatar>
                    {s.prenom} {s.nom} · {s.classe}
                    <button
                      type="button"
                    onClick={() => removeChild(Number(s.id))}
                      className="ml-0.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Student search */}
            <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
              <div className="flex items-center px-3 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <div className="max-h-36 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    {studentSearch ? "Aucun résultat trouvé" : "Tous les étudiants sont déjà sélectionnés"}
                  </p>
                ) : (
                  filteredStudents.slice(0, 8).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleChild(Number(s.id))}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10 transition-colors text-left"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={s.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {s.prenom[0]}{s.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.prenom} {s.nom}</p>
                        <p className="text-xs text-muted-foreground">{s.classe}</p>
                      </div>
                      <span className="text-xs text-primary font-medium">+ Ajouter</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-secondary"
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {parent ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
