import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Archive, Boxes, Pencil, Plus, RotateCcw, Search } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { toast } from 'sonner'
import { useAdminProjects, useProjectMutations } from '@/hooks/useAdmin'
import { Panel } from '@/components/ui/Panel'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { DifficultyPill, StatusPill } from '@/components/ui/Pills'
import { SkeletonList } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { PROJECT_CATEGORIES } from '@/data/mock/projects'
import { DIFFICULTY_LABEL, formatDate } from '@/utils/format'
import { formatXpRange, xpForDifficulty } from '@/config/scoring'
import type { Difficulty, Project, ProjectCategory, ProjectStatus } from '@/types'

/* ---------------------------------------------------------------- schema */

const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().min(4, 'Add a one-line description'),
  description: z.string().min(20, 'Describe the repository in at least 20 characters'),
  repositoryUrl: z.string().url('Must be a valid GitHub URL'),
  adminName: z.string().min(2, 'Assign a project admin'),
  adminUsername: z.string().min(2, 'GitHub username required'),
  category: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  status: z.enum(['active', 'upcoming', 'completed', 'archived']),
  technologies: z.string().min(2, 'List at least one technology'),
  slotsTotal: z.number().int().min(1, 'At least one slot'),
  openIssues: z.number().int().min(0),
})

type ProjectForm = z.infer<typeof projectSchema>

const DEFAULTS: ProjectForm = {
  name: '',
  tagline: '',
  description: '',
  repositoryUrl: 'https://github.com/',
  adminName: '',
  adminUsername: '',
  category: 'Developer Tools',
  difficulty: 'medium',
  status: 'active',
  technologies: 'React, TypeScript',
  slotsTotal: 20,
  openIssues: 0,
}

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
] as const

/* ------------------------------------------------------------------ page */

export default function AdminProjects() {
  const { data: projects = [], isLoading, isError, refetch } = useAdminProjects()
  const mutations = useProjectMutations()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [confirmArchive, setConfirmArchive] = useState<Project | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: DEFAULTS,
  })

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
        project.repositoryUrl.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [projects, search, statusFilter])

  const openCreate = () => {
    setEditing(null)
    reset(DEFAULTS)
    setModalOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    reset({
      name: project.name,
      tagline: project.tagline,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      adminName: project.admin.name,
      adminUsername: project.admin.username,
      category: project.category,
      difficulty: project.difficulty,
      status: project.status,
      technologies: project.technologies.join(', '),
      slotsTotal: project.slotsTotal,
      openIssues: project.openIssues,
    })
    setModalOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload: Partial<Project> = {
      name: values.name,
      tagline: values.tagline,
      description: values.description,
      repositoryUrl: values.repositoryUrl,
      admin: {
        name: values.adminName,
        username: values.adminUsername,
        githubUrl: `https://github.com/${values.adminUsername}`,
      },
      category: values.category as ProjectCategory,
      difficulty: values.difficulty as Difficulty,
      status: values.status as ProjectStatus,
      technologies: values.technologies
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean),
      slotsTotal: values.slotsTotal,
      slotsAvailable: values.slotsTotal,
      openIssues: values.openIssues,
    }

    try {
      if (editing) await mutations.update.mutateAsync({ id: editing.id, patch: payload })
      else await mutations.create.mutateAsync(payload)
      toast.success(editing ? 'Project updated' : 'Project created')
      setModalOpen(false)
    } catch {
      toast.error('Could not save the project')
    }
  })

  const archive = async (project: Project) => {
    try {
      await mutations.archive.mutateAsync(project.id)
      toast.success(`${project.name} deactivated`)
    } catch {
      toast.error('Deactivation failed')
    } finally {
      setConfirmArchive(null)
    }
  }

  const restore = async (project: Project) => {
    try {
      await mutations.restore.mutateAsync(project.id)
      toast.success(`${project.name} is active again`)
    } catch {
      toast.error('Could not re-activate the repository')
    }
  }

  const watchedDifficulty = watch('difficulty')

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Repositories</h1>
          <p className="mt-1 font-mono text-xs text-dim">
            {projects.length} in the registry · {projects.filter((p) => p.status === 'active').length} active
          </p>
        </div>
        <Button icon={<Plus className="size-4" aria-hidden />} onClick={openCreate}>
          Add Repository
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative block flex-1 sm:min-w-64">
          <span className="sr-only">Search repositories</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, stack or repository..."
            className="h-9 pl-9 text-sm"
          />
        </label>
        <Select
          aria-label="Filter by status"
          className="h-9 w-auto py-1 text-xs"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          {STATUS_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <SkeletonList count={5} />
      ) : isError ? (
        <ErrorState title="Unable to load repositories" onRetry={() => void refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title={projects.length === 0 ? 'No repositories yet.' : 'Nothing matches this view.'}
          description={
            projects.length === 0
              ? 'Create the first repository entry to publish problem statements.'
              : 'Clear the search or switch the status filter.'
          }
        />
      ) : (
        <Panel className="overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_1fr_120px_120px_150px_170px] gap-4 border-b border-line px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-dim lg:grid">
            <span>Repository</span>
            <span>Stack</span>
            <span>Difficulty</span>
            <span>Status</span>
            <span>Issues &amp; XP</span>
            <span className="text-right">Actions</span>
          </div>

          <ul>
            {visible.map((project) => (
              <li
                key={project.id}
                className="grid gap-3 border-b border-line px-4 py-4 transition last:border-0 hover:bg-white/[0.02] lg:grid-cols-[1.6fr_1fr_120px_120px_150px_170px] lg:items-center lg:gap-4 lg:px-5"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                    <Boxes className="size-3.5 shrink-0 text-brand-bright" aria-hidden />
                    {project.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">{project.tagline}</p>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-mint hover:underline"
                  >
                    <GithubIcon className="size-3" />
                    {project.repositoryUrl.replace('https://github.com/', '')}
                  </a>
                  <span className="ml-2 font-mono text-[10.5px] text-dim">
                    added {formatDate(project.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded border border-line bg-white/[0.03] px-1.5 py-px font-mono text-[10.5px] text-muted">
                      {tech}
                    </span>
                  ))}
                </div>

                <div><DifficultyPill difficulty={project.difficulty} /></div>
                <div><StatusPill status={project.status} /></div>

                <div className="font-mono text-xs text-muted">
                  <p className="text-mint">{formatXpRange()}</p>
                  <p className="text-dim">
                    {project.openIssues} issues · {project.slotsAvailable}/{project.slotsTotal} slots
                  </p>
                </div>

                <div className="flex justify-start gap-2 lg:justify-end">
                  <Button size="sm" variant="outline" icon={<Pencil className="size-3.5" aria-hidden />} onClick={() => openEdit(project)}>
                    Edit
                  </Button>
                  {project.status === 'archived' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<RotateCcw className="size-3.5" aria-hidden />}
                      onClick={() => void restore(project)}
                      aria-label={`Re-activate ${project.name}`}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Archive className="size-3.5" aria-hidden />}
                      onClick={() => setConfirmArchive(project)}
                      aria-label={`Deactivate ${project.name}`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* deactivation confirmation */}
      <Modal
        open={confirmArchive !== null}
        onClose={() => setConfirmArchive(null)}
        title="Deactivate repository?"
        description="It will be removed from the public registry. Participants can no longer claim its issues."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmArchive(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={mutations.archive.isPending} onClick={() => confirmArchive && void archive(confirmArchive)}>
              Deactivate
            </Button>
          </>
        }
      >
        <div className="rounded-lg border border-line bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-ink">{confirmArchive?.name}</p>
          <p className="mt-1 font-mono text-[11.5px] text-dim">{confirmArchive?.repositoryUrl}</p>
        </div>
        <p className="mt-3 text-sm text-muted">
          You can restore it at any time from this list with the <span className="text-mint">Restore</span> action.
        </p>
      </Modal>

      {/* create / edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={editing ? `Edit ${editing.name}` : 'Add repository'}
        description="Stored through the admin API — values feed the public registry."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={() => void onSubmit()}>
              {editing ? 'Save changes' : 'Create repository'}
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void onSubmit(event)}>
          <Field label="Repository name" htmlFor="p-name" error={errors.name?.message} required>
            <Input id="p-name" invalid={Boolean(errors.name)} {...register('name')} />
          </Field>

          <Field label="GitHub URL" htmlFor="p-repo" error={errors.repositoryUrl?.message} required>
            <Input id="p-repo" invalid={Boolean(errors.repositoryUrl)} {...register('repositoryUrl')} />
          </Field>

          <Field label="Tagline" htmlFor="p-tagline" error={errors.tagline?.message} className="sm:col-span-2" required>
            <Input id="p-tagline" placeholder="One line that sells the repository" invalid={Boolean(errors.tagline)} {...register('tagline')} />
          </Field>

          <Field label="Description" htmlFor="p-desc" error={errors.description?.message} className="sm:col-span-2" required>
            <Textarea id="p-desc" invalid={Boolean(errors.description)} {...register('description')} />
          </Field>

          <Field label="Project admin" htmlFor="p-admin" error={errors.adminName?.message}>
            <Input id="p-admin" placeholder="Maintainer name" invalid={Boolean(errors.adminName)} {...register('adminName')} />
          </Field>

          <Field label="Admin GitHub handle" htmlFor="p-handle" error={errors.adminUsername?.message}>
            <Input id="p-handle" placeholder="username" invalid={Boolean(errors.adminUsername)} {...register('adminUsername')} />
          </Field>

          <Field label="Category" htmlFor="p-category">
            <Select id="p-category" {...register('category')}>
              {PROJECT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Difficulty" htmlFor="p-difficulty" hint={`Official XP for this tier: ${xpForDifficulty(watchedDifficulty)} XP`}>
            <Select id="p-difficulty" {...register('difficulty')}>
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <option key={level} value={level}>
                  {DIFFICULTY_LABEL[level]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status" htmlFor="p-status">
            <Select id="p-status" {...register('status')}>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>

          <Field label="Technologies" htmlFor="p-tech" hint="Comma separated" error={errors.technologies?.message}>
            <Input id="p-tech" invalid={Boolean(errors.technologies)} {...register('technologies')} />
          </Field>

          <Field label="Contribution slots" htmlFor="p-slots" error={errors.slotsTotal?.message}>
            <Input id="p-slots" type="number" invalid={Boolean(errors.slotsTotal)} {...register('slotsTotal', { valueAsNumber: true })} />
          </Field>

          <Field label="Open issues" htmlFor="p-issues" error={errors.openIssues?.message}>
            <Input id="p-issues" type="number" invalid={Boolean(errors.openIssues)} {...register('openIssues', { valueAsNumber: true })} />
          </Field>

          <div className="rounded-lg border border-brand/30 bg-brand/[0.07] p-3 sm:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">official scoring</p>
            <p className="mt-1.5 font-mono text-sm text-mint">{formatXpRange()}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              XP is fixed per difficulty tier (Easy 10 · Medium 30 · Difficult 50) — problem statements inherit it
              automatically.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  )
}
