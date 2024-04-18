<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as Table from '@/components/ui/table';
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { ArrowBigUpIcon, ChevronsUpDown, Check } from 'lucide-svelte';

	import { tick } from 'svelte';

	import { pb } from '@/pocketbase/client';

	import {
		animals,
		countdown,
		event,
		fetchTips,
		guess,
		tips,
	} from '@/store';
	import { toast } from 'svelte-sonner';

    export let user: {[key: string]: any} | undefined;

	let open = false;
	let value = '';
	let animalSearchValue = '';

	$: animalValues = ($animals ?? []).map((animal) => ({ value: animal.id, label: animal.name }));
	$: selectedValue = selectedEntry?.label ?? 'Wähle ein neues Tier aus...';
	$: selectedEntry = animalValues.find((animal) => animal.value === value);
	$: lazyLoadingNumber = 50;
	$: filteredAnimalValues = animalValues
		.filter((animal) => animal.label.toLowerCase().includes(animalSearchValue.toLowerCase()))
		.slice(0, lazyLoadingNumber);

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function onSelectScroll(e: any) {
		if (!e.target) return;
		if (!(e.target instanceof HTMLElement)) return;
		if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100) {
			lazyLoadingNumber += 50;
		}
	}

	async function voteForAnimal(tip: string) {
		if (!user) return;
		if ($countdown <= 0) return;
		if (!$event) return;
		if ($guess) {
            try {
                $guess = await pb.collection('tips').update(
                    $guess.id,
                    { animal: tip },
                    {
                        expand: 'animal'
                    }
                );
            } catch (e) {
                toast.error(`Fehler beim Updaten des Tipps: ${e}`);
                console.error(e);
            }
		} else {
            try {
                $guess = await pb.collection('tips').create(
                    { user: user.id, animal: tip, event: $event.id },
                    {
                        expand: 'animal'
                    }
                );
            } catch (e) {
                toast.error(`Fehler beim Hinzufügen des Tipps: ${e}`);
                console.error(e);
            }
		}
		fetchTips();
	}
</script>

<div class="flex flex-col items-center w-full">
    {#if $guess}
        <p class="mb-4 text-lg text-center">Du Tippst auf: {$guess.expand?.animal.name}</p>
    {/if}

    <div class="flex gap-2 lg:flex-row flex-col">
        <Popover.Root
            bind:open
            onOpenChange={() => {
                lazyLoadingNumber = 50;
            }}
            let:ids
        >
            <Popover.Trigger asChild let:builder>
                <Button
                    builders={[builder]}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    class="max-w-96 justify-between"
                >
                    {selectedValue}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </Popover.Trigger>
            <Popover.Content class="w-[200px] overflow-hidden p-0">
                <Command.Root shouldFilter={false}>
                    <Command.Input
                        bind:value={animalSearchValue}
                        on:input={() => (lazyLoadingNumber = 50)}
                        placeholder="Suche ein Tier..."
                    />
                    <Command.Empty>Kein Tier mit dem Namen "{animalSearchValue}" gefunden.</Command.Empty>
                    <Command.Group>
                        <div class="max-h-96 overflow-y-auto" on:scroll={onSelectScroll}>
                            {#each filteredAnimalValues as animal}
                                <Command.Item
                                    value={animal.value}
                                    onSelect={(currentValue) => {
                                        value = currentValue;
                                        closeAndFocusTrigger(ids.trigger);
                                    }}
                                >
                                    <Check
                                        class={cn('mr-2 h-4 w-4', value !== animal.value && 'text-transparent')}
                                    />
                                    {animal.label}
                                </Command.Item>
                            {/each}
                        </div>
                    </Command.Group>
                </Command.Root>
            </Popover.Content>
        </Popover.Root>
        <Button
            variant="default"
            on:click={() => voteForAnimal(selectedEntry?.value ?? '')}
            disabled={$countdown <= 0}>Hinzufügen</Button
        >
    </div>

    <div class="mt-4 w-full">
        {#if $tips}
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="text-center">Votes</Table.Head>
                        <Table.Head>Tier</Table.Head>
                        <Table.Head></Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each $tips as tip, i (i)}
                        <Table.Row>
                            <Table.Cell class="py-1 text-center">{tip.count}</Table.Cell>
                            <Table.Cell class="py-1">{tip.name}</Table.Cell>
                            <Table.Cell class="py-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    on:click={() => voteForAnimal(tip.id)}
                                    disabled={$guess?.expand?.animal.name === tip.name || $countdown <= 0}
                                    ><ArrowBigUpIcon /></Button
                                >
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell class="text-muted-foreground">Noch keine Votes vorhanden.</Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                        <!-- <div>
                            <p class="text-center p-2 text-muted-foreground">Noch keine Votes vorhanden.</p>
                        </div> -->
                    {/each}
                </Table.Body>
            </Table.Root>
        {:else}
            <div>
                <p class="p-2">Loading data...</p>
            </div>
        {/if}
    </div>
</div>