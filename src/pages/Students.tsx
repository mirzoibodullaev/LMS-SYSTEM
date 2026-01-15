import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/hooks/queries";
import type { Student } from "@/types";

const statusLabels = {
  active: "Активен",
  inactive: "Неактивен",
  graduated: "Выпускник",
};

const statusVariants = {
  active: "success",
  inactive: "destructive",
  graduated: "secondary",
} as const;

type StudentFormData = Omit<Student, "id">;

const emptyForm: StudentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  group: "",
  enrolledAt: new Date().toISOString().split("T")[0],
  status: "active",
};

export function Students() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(emptyForm);

  const { data: students, isLoading } = useStudents();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const filteredStudents = students?.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search.toLowerCase()) ||
      student.lastName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.group.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      group: student.group,
      enrolledAt: student.enrolledAt,
      status: student.status,
    });
    setModalOpen(true);
  };

  const openDeleteModal = (student: Student) => {
    setDeletingStudent(student);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await updateMutation.mutateAsync({
        id: editingStudent.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deletingStudent) {
      await deleteMutation.mutateAsync(deletingStudent.id);
      setDeleteModalOpen(false);
      setDeletingStudent(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Студенты</h1>
          <p className="mt-1 text-muted-foreground">
            Управление студентами и их данными
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Список студентов</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, email, группе..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Студент</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Группа</TableHead>
                  <TableHead className="font-semibold">
                    Дата зачисления
                  </TableHead>
                  <TableHead className="font-semibold">Статус</TableHead>
                  <TableHead className="font-semibold w-24">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                        {student.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(student.enrolledAt).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[student.status]}>
                        {statusLabels[student.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(student)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filteredStudents?.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Студенты не найдены</p>
              <p className="text-sm text-muted-foreground">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? "Редактировать студента" : "Добавить студента"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя</label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Фамилия</label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Группа</label>
              <Input
                value={formData.group}
                onChange={(e) =>
                  setFormData({ ...formData, group: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Дата зачисления</label>
              <Input
                type="date"
                value={formData.enrolledAt}
                onChange={(e) =>
                  setFormData({ ...formData, enrolledAt: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Статус</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Student["status"],
                })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="graduated">Выпускник</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Сохранение..."
                : editingStudent
                ? "Сохранить"
                : "Добавить"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Удалить студента"
      >
        <p className="text-muted-foreground">
          Вы уверены, что хотите удалить студента{" "}
          <span className="font-medium text-foreground">
            {deletingStudent?.firstName} {deletingStudent?.lastName}
          </span>
          ? Это действие нельзя отменить.
        </p>
        <div className="flex justify-end gap-3 pt-6">
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
          >
            Отмена
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Удаление..." : "Удалить"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
