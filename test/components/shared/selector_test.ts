require('jsdom-global')();

import SelectorComponent from "../../../source/components/shared/selector";

import { shallowMount, Wrapper } from '@vue/test-utils'
import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';

const DEFAULT_OPTIONS = ['aaa', 'bbb', 'ccc'];

function assertIsOptionWithText(element: HTMLOptionElement, text: string) {
  assert.equal(element.text, text);
}

function getOptionChildren(select: HTMLSelectElement): HTMLOptionElement[] {
  const result: HTMLOptionElement[] = [];
  for (let child of Array.from(select.children)) {
    if (child instanceof HTMLOptionElement) {
      result.push(child);
    }
  }
  return result;
}

describe('SelectorComponent', () => {
  let wrapper: Wrapper<SelectorComponent>;
  let element: HTMLSelectElement;

  beforeEach(() => {
    wrapper = shallowMount(SelectorComponent, {
      propsData: {
        optionsArray: DEFAULT_OPTIONS,
      },
    });
    element = wrapper.element as HTMLSelectElement;
  }),

  it('renders', () => {
    assert.equal(element.tagName, 'SELECT');
    assert.equal(element.type, 'select-one');

    const children = getOptionChildren(element);
    assert.lengthOf(children, 3);
    assertIsOptionWithText(children[0], '1. aaa');
    assertIsOptionWithText(children[1], '2. bbb');
    assertIsOptionWithText(children[2], '3. ccc');
  });

  it('has first option selected by default', () => {
    const children = getOptionChildren(element);
    assert.isTrue(children[0].selected);
    assert.isNotTrue(children[1].selected);
    assert.isNotTrue(children[2].selected);
  });

  it('changing selectedIndex changes the selected option', async () => {
    wrapper.vm.selectedIndex = 2;
    await wrapper.vm.$nextTick();

    const children = getOptionChildren(element);
    assert.isNotTrue(children[0].selected);
    assert.isNotTrue(children[1].selected);
    assert.isTrue(children[2].selected);
  });

  it('emits an event on update', async () => {
    element.value = '2';
    wrapper.find('select').trigger('change');
    const emissions = wrapper.emitted().change!;
    assert.isOk(emissions, 'At least 1 "change" event should have been emitted');
    assert.lengthOf(emissions, 1, 'Exactly 1 "change" event should have been emitted');
    assert.lengthOf(emissions[0], 1, 'The event should have exactly 1 parameter');
    assert.equal(emissions[0][0], 2, 'The event should have the same value as the element');
  });
});
