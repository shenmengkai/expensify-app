import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {Keyboard} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import TextInput from '@components/TextInput';
import useAutoFocusInput from '@hooks/useAutoFocusInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ReportFields from '@libs/actions/Policy/ReportFields';
import Navigation from '@libs/Navigation/Navigation';
import {validateReportFieldListValueName} from '@libs/WorkspaceReportFieldsUtils';
import type {SettingsNavigatorParamList} from '@navigation/types';
import AccessOrNotFoundWrapper from '@pages/workspace/AccessOrNotFoundWrapper';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type SCREENS from '@src/SCREENS';
import INPUT_IDS from '@src/types/form/WorkspaceReportFieldsForm';

type WorkspaceAddValuePageProps = StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.REPORT_FIELDS_ADD_VALUE>;

function WorkspaceAddValuePage({route}: WorkspaceAddValuePageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {inputCallbackRef} = useAutoFocusInput();
    const [formDraft] = useOnyx(ONYXKEYS.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT);

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.WORKSPACE_REPORT_FIELDS_FORM>) =>
            validateReportFieldListValueName(values[INPUT_IDS.VALUE_NAME].trim(), '', formDraft?.[INPUT_IDS.LIST_VALUES] ?? [], INPUT_IDS.VALUE_NAME),
        [formDraft],
    );

    const createValue = useCallback((values: FormOnyxValues<typeof ONYXKEYS.FORMS.WORKSPACE_REPORT_FIELDS_FORM>) => {
        ReportFields.createReportFieldsListValue(values[INPUT_IDS.VALUE_NAME]);
        Keyboard.dismiss();
        Navigation.goBack();
    }, []);

    return (
        <AccessOrNotFoundWrapper
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={route.params.policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED}
        >
            <ScreenWrapper
                includeSafeAreaPaddingBottom={false}
                style={[styles.defaultModalContainer]}
                testID={WorkspaceAddValuePage.displayName}
                shouldEnableMaxHeight
            >
                <HeaderWithBackButton
                    title={translate('workspace.reportFields.addValue')}
                    onBackButtonPress={Navigation.goBack}
                />
                <FormProvider
                    formID={ONYXKEYS.FORMS.WORKSPACE_REPORT_FIELDS_FORM}
                    onSubmit={createValue}
                    submitButtonText={translate('common.save')}
                    validate={validate}
                    style={[styles.mh5, styles.flex1]}
                    enabledWhenOffline
                >
                    <InputWrapper
                        InputComponent={TextInput}
                        maxLength={CONST.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH}
                        label={translate('common.value')}
                        accessibilityLabel={translate('common.value')}
                        inputID={INPUT_IDS.VALUE_NAME}
                        role={CONST.ROLE.PRESENTATION}
                        ref={inputCallbackRef}
                    />
                </FormProvider>
            </ScreenWrapper>
        </AccessOrNotFoundWrapper>
    );
}

WorkspaceAddValuePage.displayName = 'WorkspaceAddValuePage';

export default WorkspaceAddValuePage;
