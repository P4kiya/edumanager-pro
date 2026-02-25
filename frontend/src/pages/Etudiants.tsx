import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StudentForm, Student } from "@/components/dashboard/StudentForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Filter, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ObjectifBaseStudentsData as studentsData } from "@/data/mockStudents";

export type { Student } from "@/components/dashboard/StudentForm";

const classes = ["Toutes", "6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C"];
const statuts = ["Tous", "actif", "inactif"];
const itemsPerPageOptions = [5, 10, 20, 50];

const Etudiants = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("Toutes");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClasse = selectedClasse === "Toutes" || student.classe === selectedClasse;
      const matchesStatut = selectedStatut === "Tous" || student.statut === selectedStatut;

      return matchesSearch && matchesClasse && matchesStatut;
    });
  }, [students, searchQuery, selectedClasse, selectedStatut]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast({
      title: "Étudiant supprimé",
      description: "L'étudiant a été supprimé avec succès.",
    });
    // Adjust current page if needed
    const newTotal = Math.ceil((filteredStudents.length - 1) / itemsPerPage);
    if (currentPage > newTotal && newTotal > 0) {
      setCurrentPage(newTotal);
    }
  };

  const handleSaveStudent = (data: Omit<Student, "id"> & { id?: string }) => {
    if (data.id) {
      setStudents(students.map((s) => 
        s.id === data.id 
          ? { ...s, ...data, avatar: data.avatar || s.avatar } 
          : s
      ));
      toast({
        title: "Étudiant modifié",
        description: "Les informations ont été mises à jour.",
      });
    } else {
      const newStudent: Student = {
        ...data,
        id: Date.now().toString(),
        avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${data.prenom}%20${data.nom}`,
      };
      setStudents([newStudent, ...students]);
      setCurrentPage(1); // Go to first page to see new student
      toast({
        title: "Étudiant ajouté",
        description: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClasse("Toutes");
    setSelectedStatut("Tous");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedClasse !== "Toutes" || selectedStatut !== "Tous";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Étudiants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez la liste des étudiants inscrits
          </p>
        </div>
        
        <Button 
          onClick={handleAddStudent}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un étudiant
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filter Toggle (mobile) */}
          <Button
            variant="outline"
            className="lg:hidden border-border text-foreground gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>

          {/* Filters (desktop always visible, mobile toggleable) */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4",
            showFilters ? "flex" : "hidden lg:flex"
          )}>
            <Select value={selectedClasse} onValueChange={(v) => handleFilterChange(setSelectedClasse, v)}>
              <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {classes.map((c) => (
                  <SelectItem key={c} value={c} className="text-foreground">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatut} onValueChange={(v) => handleFilterChange(setSelectedStatut, v)}>
              <SelectTrigger className="w-full sm:w-[130px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {statuts.map((s) => (
                  <SelectItem key={s} value={s} className="text-foreground capitalize">
                    {s === "Tous" ? "Tous" : s === "actif" ? "Actif" : "Inactif"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mt-4">
          {filteredStudents.length} étudiant{filteredStudents.length !== 1 ? "s" : ""} trouvé{filteredStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Étudiant</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Téléphone</TableHead>
              <TableHead className="text-muted-foreground font-medium">Classe</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Statut</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow 
                key={student.id} 
                className="border-border transition-colors hover:bg-secondary/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {student.prenom[0]}{student.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <button 
                        onClick={() => navigate(`/etudiants/${student.id}`)}
                        className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {student.prenom} {student.nom}
                      </button>
                      <p className="text-xs text-muted-foreground sm:hidden">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">{student.email}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{student.telephone}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {student.classe}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className={cn(
                    student.statut === "actif" ? "badge-success" : "badge-warning"
                  )}>
                    {student.statut === "actif" ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem 
                        onClick={() => handleEditStudent(student)}
                        className="text-foreground cursor-pointer gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-destructive cursor-pointer gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Aucun étudiant trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Afficher</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 bg-secondary/50 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()} className="text-foreground">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>par page</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground mr-4">
                {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} sur {filteredStudents.length}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        currentPage === pageNum 
                          ? "bg-primary text-primary-foreground" 
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </DashboardLayout>
  );
};

export default Etudiants;
