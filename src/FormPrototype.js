/*
 TODO:
 * Associate form control hint messages using aria-describedby rather than aria-labelledby.
 * Add aria-required to the form controls.
 * Remove <span> elements with aria-label="required", as aria-label is not allowd on <span> elements.
 * Inconsistency of the change event callbacks for Dropdown, RadioGroup and Input. Concretely, the "name" property is missing in the Dropdown props object. On the other hand, in case of RadioGroup, why there is a need for the name property in the items object?
 * Navigation in Dropdown using arrow keys is sometimes not working on macOS. Try it also on Fluent UI website on examples.
* Try using ref in the searchInput prop of the Dropdown instead of searching the DOM. * Check the accessibility section and props for the Dropdown component.
 * Read the "do" section in the Fluent UI documentation.
 */
/*
### Accessibility remarks
 * The "required" HTML attribute is not used on the form fields because on the form submission, when some required field is empty, the browser's native alert message takes priority and makes the custom live region message not be spoken. The "aria-required" behaves differently, as it does not cause the browser's native message be narrated upon a submission of a form with an empty required field. Thus, "aria-required" should be used instead of "required".
 * With JAWS, the descriptions provided by "aria-describedby" are not spoken when the verbosity setting is set to "Advanced". In NVDA, the reading of descriptions can be disabled by unchecking Settings > Object presentation > "Report object descriptions". Both in JAWS and NVDA, the defaults are that the descriptions are read, and it can be counted with that the vast majority of users have this default setting.
 * With JAWS, NVDA and VoiceOver on macOS, one difference between "aria-labelledby" and "aria"describedby" is that the "aria-describedby" message is spoken after the browser's native message caused by the aria-invalid="true", whereas the "aria-labelledby" message is spoken before. Therefore, in this prototype, the hint for the field is attached rather using aria-labelledby" so that the hint is read before the browser's native aria-invalid="true" message.
 * Otherwise, "aria-labelledby" and "aria-describedby" behave the same way, except for VoiceOver on macOS where the reading order on the blur event is following: 1) The "aria-labelledby" message of the newly focused field. 2) the live region ("aria-live", role="alert" or role="status") message created in the blur event. 3) Lastly, the "aria-describedby" message of the newly focused field is read approx. two seconds after the previous message. Whereas with JAWS and NVDA the order is (1), (3), (2).
 * The "aria-errormessage" attribute on an invalid field is not used and "aria-lablledby" is used instead because:
 * When the invalid field gets focus, the content of the element which is pointed to by "aria-errormessage" is automatically narrated by the screen reader only in case of JAWS, not with NVDA or VoiceOver on macOS which both behave as if the "aria-errormessage" attribute was not present.
 * The "aria-errormessage" message is narrated , after the browser's native error message caused by the presence of the "aria-invalid" attribute", whereas the "aria-labelledby" message is narrated before. Since we want the error message be narrated as soon as possible, the "aria-labelledby" is preferred.
 * Sometimes (don't know exact repro steps), when leaving an invalid field, Google Chrome on macOS does not read the live region ("aria-live", role="alert" or role="status"), which contains the hint. Therefore, in our form, the hint is attached also using "aria-labelledby" so that on macOS the hint is read at least when the invalid field gets focus.
 * On the blur event, with JAWS and NVDA, "aria-live", role="alert" and role="status" all behave the same way, that is, their element's content is read after the "aria-labelledby" and "aria-describedby" messages of the newly focused field. The only difference is with VoiceOver on macOS where the message provided using aria-live="assertive" or role="alert" takes the priority and interrupts the "aria-labelledby" message.
 */
import React from 'react';
import { Provider, themes, Ref, Input, RadioGroup, Dropdown, Checkbox, Button} from '@fluentui/react-northstar'

class FormPrototype extends React.Component {
  constructor(props) {
    super(props);
    
    // Set the default values for the controls
    this.state = {
    values: {
    firstName: '',
    lastName: '',
    gender: undefined,
    captain: undefined,
    username: '',
    terms: undefined,
    },
    invalid: {
    firstName: false,
    lastName: false,
    gender: false,
    captain: false,
    username: false,
    terms: false,
    },
    };
    this.validations = {
    firstName: {
    type: 'field',
    regexes: [/^[A-Za-zÀ-ÖØ-öø-ÿěščřžďťňůĚŠČŘŽĎŤŇŮ -]{1,20}$/],
    errorMsgRef: React.createRef()
    },
    lastName: {
    type: 'field',
    regexes: [/^[A-Za-zÀ-ÖØ-öø-ÿěščřžďťňůĚŠČŘŽĎŤŇŮ -]{1,20}$/],
    errorMsgRef: React.createRef()
    },
    gender: {
    type: 'radio',
    onErrorFocusRef: React.createRef(),
    isRequired: true,
    errorMsgRef: React.createRef()
    },
    captain: {
    type: 'dropdown',
    onErrorFocusRef: React.createRef(),
    isRequired: true,
    errorMsgRef: React.createRef()
    },
    username: {
    type: 'field',
    regexes: [/^[\w-]{3,20}$/],
    errorMsgRef: React.createRef()
    },
    terms: {
    type: 'checkbox',
    onErrorFocusRef: React.createRef(),
    isRequired: true,
    errorMsgRef: React.createRef()
    },
    };
    
    this.handleControlChange = this.handleControlChange.bind(this);
    this.handleControlBlur = this.handleControlBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  } // End constructor;
  
  render() {
    return (
            <Provider theme={themes.teams}>
            <form onSubmit={this.handleSubmit}>
            <label htmlFor="firstName" id="firstNameLabel">First name<span aria-label=" - required">*</span>:</label>
            <Input
            name="firstName"
            id="firstName"
            value={this.state.values.firstName}
            onChange={this.handleControlChange}
            onBlur={(event, props) => {
      this.handleControlBlur(event, {name: 'firstName'});
    }}
            aria-labelledby="firstNameLabel firstNameHint firstNameHint1 firstNameHint2"
            aria-invalid={this.state.invalid.firstName}
            />
            <ErrorMessage ref={this.validations.firstName.errorMsgRef} controlName="firstName">
            <p id="firstNameHint">First name is invalid. It must</p>
            <ul>
            <li id="firstNameHint1">have at maximum 20 characters,</li>
            <li id="firstNameHint2">contain only lowercase or uppercase letters, spaces or hyphens.</li>
            </ul>
            </ErrorMessage>
            
            <label htmlFor="lastName" id="lastNameLabel">Last name<span aria-label=" - required">*</span>:</label>
            <Input
            name="lastName"
            id="lastName"
            value={this.state.values.lastName}
            onChange={this.handleControlChange}
            onBlur={(event, props) => {
      this.handleControlBlur(event, {name: 'lastName'});
    }}
            aria-labelledby="lastNameLabel lastNameHint lastNameHint1 lastNameHint2"
            aria-invalid={this.state.invalid.lastName}
            />
            <ErrorMessage ref={this.validations.lastName.errorMsgRef} controlName="lastName">
            <p id="lastNameHint">Last name is invalid. It must</p>
            <ul>
            <li id="lastNameHint1">have at maximum 20 characters,</li>
            <li id="lastNameHint2">contain only lowercase or uppercase letters, spaces or hyphens.</li>
            </ul>
            </ErrorMessage>
            
            <label htmlFor="gender" id="genderLabel">Gender<span aria-label=" - required">*</span></label>
            <Ref innerRef={this.validations.gender.onErrorFocusRef}>
            <RadioGroup
id="gender"
            items={[
                    {
            name: 'gender',
            key: 'Male',
            label: 'Male',
            value: 'male',
            },
                    {
            name: 'gender',
            key: 'Female',
            label: 'Female',
            value: 'female',
            },
                    ]}
            McheckedValue={this.state.values.gender}
            onCheckedValueChange={this.handleControlChange}
            onBlur={(event) => {
      this.handleControlBlur(event, {name: 'gender'});
    }}
            aria-labelledby="genderLabel genderHint"
            aria-invalid={this.state.invalid.gender}
            />
            </Ref>
            <ErrorMessage ref={this.validations.gender.errorMsgRef} controlName="gender">
            <p id="genderHint">Please select the gender.</p>
            </ErrorMessage>
            
            <label htmlFor="captain" id="captainLabel">Your favourite captain<span aria-label=" - required">*</span>:</label>
            <Ref innerRef={this.validations.captain.onErrorFocusRef}>
            <Dropdown
id="captain"
            search
            items={[
                    'Samantha Carter',
                    'Jean-Luc Picard',
                    'Captain America',
                    'Jonathan Archer',
                    'James T. Kirk',
                    'Captain Power',
                    ]}
            value={this.state.values.captain}
            placeholder="Please select"
            onChange={(event, props) => {
      props.name = 'captain';
      this.handleControlChange(event, props);
    }}
            onBlur={(event) => {
      this.handleControlBlur(event, {name: 'captain'});
    }}
            getA11ySelectionMessage={{
    onAdd: item => `${item} has been selected.`,
    }}
            aria-labelledby="captainLabel captainHint"
            searchInput={{
'aria-invalid': this.state.invalid.captain
}}
            />
            </Ref>
            <ErrorMessage ref={this.validations.captain.errorMsgRef} controlName="captain">
            <p id="captainHint">Please select your favourite captain.</p>
            </ErrorMessage>
            
            
            <label htmlFor="username" id="usernameLabel">Username<span aria-label=" - required">*</span>:</label>
            <Input
            name="username"
            id="username"
            value={this.state.values.username}
            onChange={this.handleControlChange}
            onBlur={(event, props) => {
      this.handleControlBlur(event, {name: 'username'});
    }}
            aria-labelledby="usernameLabel usernameHint usernameHint1 usernameHint2"
            aria-invalid={this.state.invalid.username}
            />
            <ErrorMessage ref={this.validations.username.errorMsgRef} controlName="username">
            <p id="usernameHint">Username is invalid. It must</p>
            <ul>
            <li id="usernameHint1">have between 3 and 20 characters,</li>
            <li id="usernameHint2">contain only lowercase or uppercase letters, numbers, hyphens, or underscores.</li>
            </ul>
            </ErrorMessage>

            <Ref innerRef={this.validations.terms.onErrorFocusRef}>
<Checkbox
id="terms"
label={<label htmlFor="terms" id="termsLabel">I accept the terms and conditions		.<span aria-label=" - required">*</span></label>}
checked={this.state.values.terms}
            onChange={(event, props) => {
      props.name = 'terms';
      props.value = props.checked;
      this.handleControlChange(event, props);
    }}
            onBlur={(event) => {
      this.handleControlBlur(event, {name: 'terms'});
    }}
            aria-labelledby="termsLabel termsHint"
/>
            </Ref>
            <ErrorMessage ref={this.validations.terms.errorMsgRef} controlName="terms">
            <p id="termsHint">You must accept the terms and conditions.</p>
            </ErrorMessage>

<p>Fields marked with * are required</p> 
            <Button>Submit</Button>
            </form>
            </Provider>
            );
  } // End render
  
  handleControlChange(event, props) {
    const stateUpdate = {[props.name]: props.value};
    this.setState({values: {...this.state.values, ...stateUpdate}});
  } // End handleControlChange
  
  handleControlBlur(event, props) {
    this.validateControl(props.name);
  } // End handleControlBlur
  
  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      alert('The form is valid and would have been submitted.');
    }
  } // End handleSubmit
  
  validateControl(name) {
    // First hide the error message if exists
    const validation = this.validations[name];
    const errorComponent = validation.errorMsgRef.current;
    errorComponent.hide();
    
    // If the control value is invalid, show the error and set the aria-invalid attribute
    const value = this.state.values[name];
    let isInvalid = false;
    if (validation.type === "field") { // begin if 1
      for (let i = 0; i < validation.regexes.length; i++) { // Begin for 1
        if (!validation.regexes[i].exec(value)) { // Begin if 2
          isInvalid = true;
          break;
        } // End if 2
      } // End for 1
    } else if ((validation.type === "radio") && validation.isRequired && !value) { // else if 1
      isInvalid = true;
    } else if ((validation.type === "dropdown") && validation.isRequired && !value) { // else if 1
      isInvalid = true;
    } else if ((validation.type === "checkbox") && validation.isRequired && !value) { // else if 1
      isInvalid = true;
    } // End if 1
    if (isInvalid) { // Begin if 1
      errorComponent.show();
      const stateUpdate = {[name]: isInvalid};
      this.setState({invalid: {...this.state.invalid, ...stateUpdate}});
      return false
    } // End if 1
    return true;
  } // End validateControl
  
  validateForm() {
// Validate all the controls
    for (const name in this.validations) { // Begin for 1
      if (!this.validateControl(name)) { // Begin if 1
        // Set the focus to the invalid control
        const validation = this.validations[name];
        let invalidControl;
        if (validation.type === 'field') { // Begin if 2
          invalidControl = document.getElementById(name);
        } else if (validation.type === 'radio') { // Else if 2
          invalidControl = validation.onErrorFocusRef.current.querySelector('*[role="radio"]');
        } else if (validation.type === 'checkbox') { // Else if 2
          invalidControl = validation.onErrorFocusRef.current;
        } else if (validation.type === 'dropdown') { // Else if 2
          invalidControl = validation.onErrorFocusRef.current.querySelector('input') || validation.onErrorFocusRef.current.querySelector('*[role="button"]');
        } // End if 2
        invalidControl.focus();
        return false;
      } // End if 1
    } // End for 1
    return true;
  } // End validateForm
  
} // End FormPrototype

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    isHidden: true
    }
  } // End constructor
  
  render() {
    const id = this.props.controlName + 'Error';
    return (
            <div id={id} className="error" role="alert">
    {this.state.isHidden ? null : this.props.children}
            </div>
            );
  } // End render
  
  show() {
    // Show the error after a delay so the screen reader can register the change, and so that the full label of the next tabbed item is read completely
    const delay = 1000;
    setTimeout(() => {
      this.setState({
      isHidden: false
      }); // End setState
    }, delay); // End setTimeout
  } // End show
  
  hide() {
    this.setState({
    isHidden: true
    }); // End setState
  } // End hide
} // End ErrorMessage

export default FormPrototype;
