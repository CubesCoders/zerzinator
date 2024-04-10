
<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { animals, event } from '@/store';
	import { Button } from '@/components/ui/button';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { cn } from '@/utils';
	import { tick } from 'svelte';
	import { pb } from '@/pocketbase/client';
	import { type TipsResponse, type AnimalsResponse, type UsersResponse } from '@/pocketbase';

	$: animalValues = ($animals ?? []).map((animal) => ({ value: animal.id, label: animal.name }));
	$: selectedValue =
		selectedEntry?.label ?? 'Wähle ein neues Tier aus...';
	$: selectedEntry = animalValues.find((animal) => animal.value === value);
	$: lazyLoadingNumber = 50;
	$: filteredAnimalValues = animalValues.filter((animal) =>
		animal.label.toLowerCase().includes(animalSearchValue.toLowerCase())
	).slice(0, lazyLoadingNumber);
	$: date = new Date($event?.start ?? 0);

	let open = false;
	let value = '';
	let animalSearchValue = '';
    
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

    async function setAnimal() {
        if (!$event) return;
        if (!selectedEntry) return;
        if (!$animals) return;
        if ((Date.now() - date.getTime() + (1000 * 60 * 30)) <= 0) {
            alert('Die Abstimmung ist noch im Gange.');
            return;
        }
        if ($event.animal) {
            alert('Ein Tier wurde bereits ausgewählt.');
            return;
        }
        const entry = selectedEntry;
        pb.collection('events').update($event.id, {
            animal: entry.value
        });

        const tips = await pb.collection("tips").getFullList({
            filter: `event = "${$event.id}"`,
            expand: "user,animal"
        }) as TipsResponse<{user: UsersResponse, animal: AnimalsResponse}>[];

        const animal = $animals.find((animal) => animal.id === entry.value);
        if (!animal) return;

        for (const tip of tips) {
            if (tip.animal === animal.id) {
                await pb.collection("users").update(tip.user, {
                    points: (tip.expand?.user?.points ?? 0) + 500
                });
            } else if (tip.expand?.animal?.species === animal.species) {
                await pb.collection("users").update(tip.user, {
                    points: (tip.expand?.user?.points ?? 0) + 50
                });
            } else if (tip.expand?.animal?.type === animal.type) {
                await pb.collection("users").update(tip.user, {
                    points: (tip.expand?.user?.points ?? 0) + 5
                });
            }
        }
    }
</script>

<div class="container">
    <p>
        Hallo Admin Setting Animal for {date.toLocaleString()}
    </p>
    <Popover.Root bind:open onOpenChange={() => {lazyLoadingNumber = 50}} let:ids>
        <Popover.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                class="w-[200px] justify-between"
            >
                {selectedValue}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] overflow-hidden p-0">
            <Command.Root shouldFilter={false}>
                <Command.Input bind:value={animalSearchValue}  on:input={() => lazyLoadingNumber = 50} placeholder="Suche ein Tier..." />
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
    <Button variant="default" on:click={setAnimal}>Hinzufügen</Button>
</div>