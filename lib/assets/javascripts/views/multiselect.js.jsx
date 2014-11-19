/** @jsx React.DOM */

(function () {

"use strict";

Drop.Views.Multiselect = React.createClass({
	displayName: 'Marbles.Views.ContactSelector',

	getInitialState: function () {
		return {
			selectedValues: [],
			selectedItems: [],
			selectedIndex: null,
			selectableItems: [],
			selectableIndex: 0
		};
	},

	componentDidMount: function () {
		this.updateItemsFromProps(this.props);
	},

	componentWillReceiveProps: function (props) {
		this.updateItemsFromProps(props);
	},

	updateItemsFromProps: function (props) {
		var items = [], component = this, i, _ref, _len;
		var itemLookup = function (value, i) {
			props.itemLookup(value, function (item) {
				items = items.slice(0, i).concat([item]).concat(items.slice(i+1, items.length));

				if (items.length === _len) {
					component.setState({
						selectedItems: items
					});
				}
			});
		};
		if (props.selectedValues && this.state.selectedValues !== props.selectedValues) {
			for (i = 0, _ref = props.selectedValues, _len = _ref.length; i < _len; i++) {
				itemLookup(_ref[i], i);
			}
		}
	},

	handleContainerClick: function () {
		this.refs.input.getDOMNode().focus();
	},

	handleInputChange: function () {
		var value = this.refs.input.getDOMNode().value.trim();

		this.adjustInputSize();

		if (value.length === 0) {
			this.setState({
				selectableItems: []
			});
			return;
		}

		var component = this;
		clearTimeout(this.__lookupTimeout);
		this.__lookupTimeout = setTimeout(function () {
			component.props.itemFuzzyLookup(value, function (matchedItems) {
				matchedItems = matchedItems.filter(function (item) {
					return component.state.selectedValues.indexOf(item.value) === -1;
				});
				component.setState({
					selectableItems: matchedItems,
					selectableIndex: 0
				});
			});
		}, 50);
	},

	handleInputKeyDown: function (e) {
		var _tmp;

		if (e.keyCode === 13) { // Enter / Return
			e.preventDefault();
			this.selectActiveItem();
		}

		if (e.keyCode === 9 && !e.shiftKey && this.props.focusNextInput) { // Tab
			e.preventDefault();
			this.props.focusNextInput();
			return;
		}

		if (this.props.handleKeyDown) {
			_tmp = this.props.handleKeyDown(e);
			if (_tmp !== undefined) {
				return _tmp;
			}
		}

		if (e.keyCode === 8 && this.refs.input.getDOMNode().selectionStart === 0) { // Backspace
			if (this.state.selectableItems.length > 0) {
				this.setState({ selectableItems: [] });
			} else if (this.state.selectedIndex !== null) {
				this.removeAtIndex(this.state.selectedIndex);
			} else {
				this.setState({
					selectedIndex: this.state.selectedItems.length-1
				});
			}
		} else {
			this.setState({
				selectedIndex: null
			});
		}

		if (this.state.selectableItems.length === 0) {
			return;
		}

		if (e.keyCode === 40 || (e.ctrlKey && e.keyCode === 74)) { // down arrow or ctrl-j
			e.preventDefault();
			this.moveCursorDown();
		}

		// make sure ctrl-a + ctrl-k still works
		var __ctrlKDisabled = this.__ctrlKDisabled;
		if (e.ctrlKey && e.keyCode === 65) {
			this.__ctrlKDisabled = true;
		} else {
			this.__ctrlKDisabled = false;
		}

		// make sure ctrl-k works as expected for clearing
		// text beyond the cursor
		if (!__ctrlKDisabled && e.ctrlKey && e.keyCode === 75) {
			var el = this.refs.input.getDOMNode();
			if (el.selectionStart < el.value.length) {
				__ctrlKDisabled = true;
			}
		}

		if (e.keyCode === 38 || (!__ctrlKDisabled && e.ctrlKey && e.keyCode === 75)) { // up arrow or ctrl-k
			e.preventDefault();
			this.moveCursorUp();
		}
	},

	hidePicker: function () {
		this.refs.input.getDOMNode().value = "";
		this.setState({ selectableItems: [] });
	},

	moveCursorDown: function () {
		var index = Math.min(this.state.selectableItems.length-1, this.state.selectableIndex + 1);
		this.setSelectableIndex(index, true);
	},

	moveCursorUp: function () {
		var index = Math.max(0, this.state.selectableIndex - 1);
		this.setSelectableIndex(index, true);
	},

	setSelectableIndex: function (index, scroll) {
		this.__scrollToSelectableIndex = !!scroll;
		this.setState({
			selectableIndex: index
		});
	},

	selectActiveItem: function () {
		if (this.state.selectableItems.length === 0) {
			return;
		}
		this.selectAtIndex(this.state.selectableIndex);
	},

	selectAtIndex: function (index) {
		var items = this.state.selectedItems;
		index = this.state.selectableIndex;
		var selectableItems = this.state.selectableItems;
		items.push(this.state.selectableItems[index]);
		selectableItems = selectableItems.slice(0, index).concat(selectableItems.slice(index+1, selectableItems.length));
		var values = items.map(function (item) {
			return item.value;
		});

		this.refs.input.getDOMNode().value = '';

		this.setState({
			selectedItems: items,
			selectedValues: values,
			selectableItems: selectableItems,
			selectableIndex: Math.max(0, Math.min(selectableItems.length-1, this.state.selectableIndex))
		});

		this.props.handleChangeSelection(values);
	},

	removeAtIndex: function (index) {
		var items = this.state.selectedItems;
		items = items.slice(0, index).concat(items.slice(index+1, items.length));
		var values = items.map(function (item) {
			return item.value;
		});

		this.setState({
			selectedItems: items,
			selectedValues: values,
			selectedIndex: null
		});

		this.handleInputChange();

		this.props.handleChangeSelection(values);
	},

	adjustInputSize: function () {
		var input = this.refs.input.getDOMNode(),
				container = this.refs.inputContainer.getDOMNode(),
				maxWidth = parseInt(window.getComputedStyle(container).width);
		input.style.setProperty('width', '20px');
		input.style.setProperty('width', Math.min(input.scrollWidth, maxWidth) +'px');
	},

	render: function () {
		var selectedItems = [];
		var selectableItems = [];
		var i, _ref, _len;
		for (i = 0, _ref = this.state.selectedItems, _len = _ref.length; i < _len; i++) {
			selectedItems.push(
				<SelectedItem
					key={_ref[i].value}
					group={_ref[i].group}
					value={_ref[i].value}
					displayText={_ref[i].displayText}
					displayImageURL={_ref[i].displayImageURL}
					displayIcon={_ref[i].displayIcon}
					active={this.state.selectedIndex === i}
					index={i}
					removeItem={this.removeAtIndex} />
			);
		}
		for (i = 0, _ref = this.state.selectableItems, _len = _ref.length; i < _len; i++) {
			selectableItems.push(
				<PickerItem
					key={_ref[i].value}
					group={_ref[i].group}
					value={_ref[i].value}
					displayText={_ref[i].displayText}
					displayImageURL={_ref[i].displayImageURL}
					displayIcon={_ref[i].displayIcon}
					active={this.state.selectableIndex === i}
					scrollIntoView={this.__scrollToSelectableIndex === true && this.state.selectableIndex === i}
					index={i}
					setActive={this.setSelectableIndex}
					select={this.selectAtIndex} />
			);
		}
		return (
			<div className='multiselect-container' onClick={this.handleContainerClick}>
				<ul className='unstyled m-input' ref='inputContainer'>
					{selectedItems}
					<li className='input'>
						<input ref='input' type='text' onChange={this.handleInputChange} onKeyDown={this.handleInputKeyDown} />
					</li>
				</ul>

				<ul className={'unstyled'+ (' m-picker'+ (selectableItems.length ? ' active' : ''))}>
					{selectableItems}
				</ul>
			</div>
		);
	}
});

var SelectedItem = React.createClass({
	displayName: 'Marbles.Views.Multiselect SelectedItem',

	handleRemoveClick: function () {
		this.props.removeItem(this.props.index);
	},

	render: function () {
		var displayImage = '';
		if (this.props.displayImageURL) {
			displayImage = <img src={this.props.displayImageURL} />;
		}
		var displayIcon = '';
		if (this.props.displayIcon) {
			displayIcon = <span className={'icon fa fa-'+ this.props.displayIcon} />;
		}

		return (
			<li title={this.props.group ? null : this.props.value} className={this.props.active ? 'active': ''}>
				{displayIcon}
				{displayImage}
				<span className='text'>{this.props.displayText}</span>
				<span className='fa fa-times remove' onClick={this.handleRemoveClick}></span>
			</li>
		);
	}
});

var PickerItem = React.createClass({
	displayName: 'Marbles.Views.Multiselect PickerItem',

	handleMouseEnter: function () {
		this.props.setActive(this.props.index);
	},

	handleClick: function () {
		this.props.select(this.props.index);
	},

	componentDidUpdate: function () {
		var el;
		if (this.props.scrollIntoView) {
			el = this.refs.el.getDOMNode();
			el.parentNode.scrollTop = Math.max(0, el.offsetTop - el.offsetHeight);
		}
	},

	render: function () {
		var displayValue = '';
		if (this.props.value !== this.props.displayText && !this.props.group) {
			displayValue = <small>{this.props.value}</small>;
		}

		var displayImage = '';
		if (this.props.displayImageURL) {
			displayImage = <img src={this.props.displayImageURL} />;
		}
		var displayIcon = '';
		if (this.props.displayIcon) {
			displayIcon = <span className={'icon fa fa-'+ this.props.displayIcon} />;
		}

		return (
			<li className={this.props.active ? 'active' : ''} onMouseEnter={this.handleMouseEnter} onClick={this.handleClick} ref='el'>
				{displayIcon}
				{displayImage}
				<span className='text'>{this.props.displayText}</span>
				<span className='value'>{displayValue}</span>
			</li>
		);
	}
});

})();
