import { useState } from "react";
import { Calendar, Users, Award, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  useAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from "@/hooks/queries";
import type { Assignment } from "@/types";

const statusLabels = {
  open: "Открыто",
  closed: "Закрыто",
  in_review: "На проверке",
};

const statusVariants = {
  open: "success",
  closed: "secondary",
  in_review: "warning",
} as const;

type AssignmentFormData = Omit<Assignment, "id" | "totalSubmissions">;

const emptyForm: AssignmentFormData = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().split("T")[0],
  status: "open",
  maxScore: 100,
};

export function Assignments() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(emptyForm);

  const { data: assignments, isLoading } = useAssignments();
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: assignment.status,
      maxScore: assignment.maxScore,
    });
    setModalOpen(true);
  };

  const openDeleteModal = (assignment: Assignment) => {
    setDeletingAssignment(assignment);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      await updateMutation.mutateAsync({
        id: editingAssignment.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deletingAssignment) {
      await deleteMutation.mutateAsync(deletingAssignment.id);
      setDeleteModalOpen(false);
      setDeletingAssignment(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Задания</h1>
          <p className="mt-1 text-muted-foreground">
            Курсовые работы и их статусы
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {assignments?.map((assignment) => {
            const isOverdue =
              new Date(assignment.dueDate) < new Date() &&
              assignment.status !== "closed";
            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="mt-1.5 line-clamp-2">
                        {assignment.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusVariants[assignment.status]}
                        className="shrink-0"
                      >
                        {statusLabels[assignment.status]}
                      </Badge>
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(assignment)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Calendar
                        className={`h-5 w-5 ${
                          isOverdue ? "text-red-500" : "text-muted-foreground"
                        }`}
                      />
                      <span className="mt-2 text-xs text-muted-foreground">
                        Дедлайн
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isOverdue ? "text-red-500" : ""
                        }`}
                      >
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-2 text-xs text-muted-foreground">
                        Сдач
                      </span>
                      <span className="text-sm font-semibold">
                        {assignment.totalSubmissions}
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-2 text-xs text-muted-foreground">
                        Макс. балл
                      </span>
                      <span className="text-sm font-semibold">
                        {assignment.maxScore}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAssignment ? "Редактировать задание" : "Добавить задание"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Курсовая работа: ..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-20 resize-none"
              placeholder="Описание задания..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Дедлайн</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Макс. балл</label>
              <Input
                type="number"
                value={formData.maxScore}
                onChange={(e) =>
                  setFormData({ ...formData, maxScore: Number(e.target.value) })
                }
                min={1}
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
                  status: e.target.value as Assignment["status"],
                })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="open">Открыто</option>
              <option value="in_review">На проверке</option>
              <option value="closed">Закрыто</option>
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
                : editingAssignment
                ? "Сохранить"
                : "Добавить"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Удалить задание"
      >
        <p className="text-muted-foreground">
          Вы уверены, что хотите удалить задание{" "}
          <span className="font-medium text-foreground">
            {deletingAssignment?.title}
          </span>
          ? Это действие нельзя отменить.
        </p>
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Отмена
          </Button>
          <Button
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
