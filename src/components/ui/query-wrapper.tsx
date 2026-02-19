import { Flex, Spinner, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";

interface BaseQueryLike<TData = unknown, TError = unknown> {
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  data?: TData;
}

interface QueryWrapperProps<TData, TError> extends Omit<FlexProps, "children"> {
  query?: BaseQueryLike<TData, TError>;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null | unknown;
  loadingText?: string;
  errorPrefix?: string;
  children?: React.ReactNode | ((data: NonNullable<TData>) => React.ReactNode);
  spinnerSize?: "sm" | "md" | "lg" | "xl";
}

export function QueryWrapper<TData = unknown, TError = Error>({
  query,
  isLoading,
  isError,
  error,
  loadingText,
  errorPrefix = "Error:",
  children,
  spinnerSize = "xl",
  ...rest
}: QueryWrapperProps<TData, TError>) {
  const _isLoading = isLoading !== undefined ? isLoading : query?.isLoading;
  const _isError = isError !== undefined ? isError : query?.isError;
  const _error = error !== undefined ? error : query?.error;
  const _data = query?.data;

  if (_isLoading) {
    return (
      <Flex justify="center" align="center" h="full" w="full" p={4} {...rest}>
        <Spinner size={spinnerSize} />
        {loadingText && <Text ml={3} color="fg.muted">{loadingText}</Text>}
      </Flex>
    );
  }

  if (_isError) {
    return (
      <Flex justify="center" align="center" h="full" w="full" p={4} {...rest}>
        <Text color="red.500">
          {errorPrefix} {(_error as Error)?.message || "Unknown error"}
        </Text>
      </Flex>
    );
  }

  if (typeof children === "function") {
    if (query && _data === undefined) {
      return null;
    }
    return <>{children(_data as NonNullable<TData>)}</>;
  }

  return <>{children}</>;
}
