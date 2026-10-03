import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminProblemStatements, useAdminProjects, useProblemStatementMutations } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { DifficultyPill, StatusPill, TypePill } from '@/components/ui/Pills'
import { SkeletonList } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { CONTRIBUTION_TYPE_LABEL, DIFFICULTY_LABEL } from '@/utils/format'
import { xpForDifficulty } from '@/config/scoring'
import type { ContributionType, Difficulty, ProblemStatement } from '@/types'

const statementSchema = z
  .object({
    title: z.string().min(6, 'Title must be descriptive'),
    description: z.string().min(20, 'Add at least 20 characters of scope'),
    projectId: z.string().min(1, 'Choose a project'),
    githubIssueUrl: z.string().url('Must be a valid issue URL'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    contributionType: z.enum([
      'bug-fix',
      'feature',
      'ui-ux',
      'documentation',
      'performance',
      'testing',
      'refactor',
      'integration',
    ]),
    technology: z.string().min(2, 'Target technology required'),
    status: z.enum(['open', 'claimed', 'in-progress', 'resolved']),
    deadline: z.string().optional(),
    requirements: z.string().min(10, 'List the acceptance criteria'),
  })

type StatementForm = z.infer<typeof statementSchema>

const DEFAULTS: StatementForm = {
  title: '',
  description: '',
  projectId: '',
  githubIssueUrl: 'https://github.com/',
  difficulty: 'medium',
  contributionType: 'bug-fix',
  technology: 'TypeScript',
  status: 'open',
  deadline: '',
  requirements: '',
}

export default function AdminProblemStatements() {
  const [projectFilter, setProjectFilter] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProblemStatement | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<ProblemStatement | null>(null)

  const { data: projects = [] } = useAdminProjects()
  const { data: statements = [], isLoading, isError, refetch } = useAdminProblemStatements(projectFilter)
  const mutations = useProblemStatementMutations()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StatementForm>({
    resolver: zodResolver(statementSchema),
    defaultValues: { ...DEFAULTS, projectId: projects[0]?.id ?? '' },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ ...DEFAULTS, projectId: projectFilter || projects[0]?.id || '' })
    setModalOpen(true)
  }

  const openEdit = (statement: ProblemStatement) => {
    setEditing(statement)
    reset({
      title: statement.title,
      description: statement.description,
      projectId: statement.projectId,
      githubIssueUrl: statement.githubIssueUrl,
      difficulty: statement.difficulty,
      contributionType: statement.contributionType,
      technology: statement.technology,
      status: statement.status as StatementForm['status'],
      deadline: statement.deadline ?? '',
      requirements: statement.requirements.join('\n'),
    })
    setModalOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload: Partial<ProblemStatement> = {
      title: values.title,
      description: values.description,
      projectId: values.projectId,
      githubIssueUrl: values.githubIssueUrl,
      difficulty: values.difficulty as Difficulty,
      contributionType: values.contributionType as ContributionType,
      technology: values.technology,
      status: values.status as ProblemStatement['status'],
      deadline: values.deadline || undefined,
      requirements: values.requirements.split('\n').map((item: string) => item.trim()).filter(Boolean),
    }

    try {
      if (editing) await mutations.update.mutateAsync({ id: editing.id, patch: payload })
      else await mutations.create.mutateAsync(payload)
      toast.success(editing ? 'Problem statement updated' : 'Problem statement published')
      setModalOpen(false)
    } catch {
      toast.error('Could not save the problem statement')
    }
  })

  const remove = async (statement: ProblemStatement) => {
    try {
      await mutations.remove.mutateAsync(statement.id)
      toast.success('Problem statement deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setConfirmDelete(null)
    }
  }

  const projectName = (id: string) => projects.find((project) => project.id === id)?.name ?? '—'
  const draftDifficulty = watch('difficulty')

  const visible = statements.filter((statement) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      statement.title.toLowerCase().includes(query) ||
      statement.technology.toLowerCase().includes(query) ||
      statement.contributionType.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Problem Statements</h1>
          <p className="mt-1 font-mono text-xs text-dim">{statements.length} entries · publish what participants can claim</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <span className="sr-only">Search problem statements</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" aria-hidden />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search issues..."
              className="h-9 w-48 pl-9 text-xs"
            />
          </label>
          <Select
            aria-label="Filter by project"
            className="h-9 w-auto py-1 text-xs"
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
          <Button icon={<Plus className="size-4" aria-hidden />} onClick={openCreate}>
            Add Problem Statement
          </Button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonList count={5} />
      ) : isError ? (
        <ErrorState title="Unable to load problem statements" onRetry={() => void refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No problem statements match."
          description="Clear the search, or publish a new one so participants have something to claim."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((statement) => (
            <li key={statement.id} className="rounded-[14px] border border-line bg-coal/80 p-4 transition hover:border-brand/35 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyPill difficulty={statement.difficulty} />
                    <TypePill type={statement.contributionType} />
                    <StatusPill status={statement.status} />
                    <span className="font-mono text-[11px] text-dim">{projectName(statement.projectId)}</span>
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-ink">{statement.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{statement.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11.5px] text-dim">
                    <span className="text-mint">+{xpForDifficulty(statement.difficulty)} XP</span>
                    <span>{statement.technology}</span>
                    <a
                      href={statement.githubIssueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-mint hover:underline"
                    >
                      <ExternalLink className="size-3" aria-hidden />
                      issue
                    </a>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" icon={<Pencil className="size-3.5" aria-hidden />} onClick={() => openEdit(statement)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" icon={<Trash2 className="size-3.5" aria-hidden />} onClick={() => setConfirmDelete(statement)}>
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="xl"
        title={editing ? 'Edit problem statement' : 'New problem statement'}
        description="Validated with Zod, persisted through the admin service layer."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={() => void onSubmit()}>
              {editing ? 'Save changes' : 'Publish'}
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void onSubmit(event)}>
          <Field label="Title" htmlFor="ps-title" error={errors.title?.message} className="sm:col-span-2" required>
            <Input id="ps-title" placeholder="Fix retry backoff on failed deliveries" invalid={Boolean(errors.title)} {...register('title')} />
          </Field>

          <Field label="Description" htmlFor="ps-desc" error={errors.description?.message} className="sm:col-span-2" required>
            <Textarea id="ps-desc" placeholder="What is broken or missing, and why it matters" invalid={Boolean(errors.description)} {...register('description')} />
          </Field>

          <Field label="Project" htmlFor="ps-project" error={errors.projectId?.message} required>
            <Select id="ps-project" invalid={Boolean(errors.projectId)} {...register('projectId')}>
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="GitHub issue URL" htmlFor="ps-url" error={errors.githubIssueUrl?.message} required>
            <Input id="ps-url" invalid={Boolean(errors.githubIssueUrl)} {...register('githubIssueUrl')} />
          </Field>

          <Field label="Difficulty" htmlFor="ps-difficulty" error={errors.difficulty?.message}>
            <Select id="ps-difficulty" invalid={Boolean(errors.difficulty)} {...register('difficulty')}>
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <option key={level} value={level}>
                  {DIFFICULTY_LABEL[level]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Contribution type" htmlFor="ps-type" error={errors.contributionType?.message}>
            <Select id="ps-type" invalid={Boolean(errors.contributionType)} {...register('contributionType')}>
              {(Object.keys(CONTRIBUTION_TYPE_LABEL) as ContributionType[]).map((type) => (
                <option key={type} value={type}>
                  {CONTRIBUTION_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Technology" htmlFor="ps-tech" error={errors.technology?.message}>
            <Input id="ps-tech" invalid={Boolean(errors.technology)} {...register('technology')} />
          </Field>

          <Field label="Status" htmlFor="ps-status" error={errors.status?.message}>
            <Select id="ps-status" invalid={Boolean(errors.status)} {...register('status')}>
              <option value="open">Open</option>
              <option value="claimed">Claimed</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
          </Field>

          <Field label="Deadline" htmlFor="ps-deadline" hint="Optional">
            <Input id="ps-deadline" type="date" {...register('deadline')} />
          </Field>

          <div className="rounded-lg border border-brand/30 bg-brand/[0.07] p-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">awards on merge</p>
            <p className="mt-1.5 font-mono text-lg font-bold text-mint">
              +{xpForDifficulty(draftDifficulty)} XP
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Fixed by the selected tier — Easy 10 · Medium 30 · Difficult 50.
            </p>
          </div>

          <Field
            label="Requirements (one per line)"
            htmlFor="ps-req"
            error={errors.requirements?.message}
            className="sm:col-span-2"
            required
          >
            <Textarea
              id="ps-req"
              rows={4}
              placeholder={'Reproduce with a test\nKeep the public API stable'}
              invalid={Boolean(errors.requirements)}
              {...register('requirements')}
            />
          </Field>

          <p className="sm:col-span-2 font-mono text-[11px] text-dim">
            selected tier: <span className="text-mint">{DIFFICULTY_LABEL[draftDifficulty].toUpperCase()}</span> ·
            XP comes from the central scoring config, not this form
          </p>
        </form>
      </Modal>

      {/* delete confirmation */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete problem statement?"
        description="Participants who claimed it lose the reference. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={mutations.remove.isPending}
              onClick={() => confirmDelete && void remove(confirmDelete)}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="rounded-lg border border-line bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-ink">{confirmDelete?.title}</p>
          <p className="mt-1 font-mono text-[11.5px] text-dim">{confirmDelete && projectName(confirmDelete.projectId)}</p>
        </div>
      </Modal>
    </div>
  )
}
