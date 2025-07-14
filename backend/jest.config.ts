//jest.config.ts
import type {JestConfigWithTsJest} from 'ts-jest'

const config: JestConfigWithTsJest = {
	extensionsToTreatAsEsm: [],
	verbose: true,
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	testPathIgnorePatterns: [],
    setupFiles: ['<rootDir>/jest.setup.ts'], // jest setup 파일 경로
	transform: {
        '^.+\\.(ts)$': ['ts-jest', { 
            useESM: true,
            tsconfig: '<rootDir>/tsconfig.jest.json'
        }], // TypeScript 파일을 ts-jest로 변환
	},
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // '@/' 경로를 루트 디렉토리로 매핑
    },
	moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'], // TypeScript 설정을 위한 옵션
};

export default config;