### 1. **Data Layer**
#### 정의:
**Data Layer**는 외부에서 데이터를 가져오고, 이를 애플리케이션 내에서 사용할 수 있는 형식으로 변환하는 책임을 가집니다. 데이터는 API 호출, 데이터베이스, 로컬 파일 시스템, SharedPreferences 등 다양한 출처에서 가져올 수 있습니다.

#### 사용 목적:
- 외부에서 데이터를 가져오거나 저장할 때 사용합니다. 예를 들어, 네트워크 통신을 통해 데이터를 받아오거나, 로컬 데이터베이스나 캐시에 데이터를 저장하는 역할을 담당합니다.
- 이 레이어는 데이터 소스(네트워크, 데이터베이스 등)에 대한 구체적인 구현을 캡슐화하고, 이를 다른 레이어에 노출하지 않습니다.

#### 구성 요소:
- **Repository**: 데이터 소스(예: API 또는 로컬 데이터베이스)와 상호작용하여 데이터를 가져오고, 가공하여 Domain Layer에 제공하는 역할을 담당합니다.
- **Data Sources**: 데이터의 실제 출처를 담당하는 부분으로, 예를 들어 API 통신을 위한 `Dio` 같은 라이브러리나 로컬 데이터베이스(`Sembast`, `SQLite` 등)와 상호작용합니다.

#### 예시:
```dart
class UserRepository {
  final ApiService apiService;

  UserRepository(this.apiService);

  Future<User> fetchUser(int id) async {
    final response = await apiService.getUserData(id);
    return User.fromJson(response.data);  // JSON 데이터를 User 객체로 변환
  }
}
```

### 2. **Domain Layer**
#### 정의:
**Domain Layer**는 애플리케이션의 **비즈니스 로직**과 **애플리케이션 상태 관리**의 중심입니다. 여기서는 데이터가 어떻게 처리되는지, 어떤 규칙에 따라 동작하는지를 정의합니다. 애플리케이션의 핵심 규칙이나 로직은 이 레이어에 속합니다.

#### 사용 목적:
- 비즈니스 로직을 구현하고, 데이터와 상호작용하는 방법을 정의합니다. Domain Layer는 Data Layer와 Presentation Layer 간의 중개 역할을 하며, 데이터의 변환 및 가공을 담당합니다.
- 외부 데이터 소스나 구체적인 구현에 의존하지 않고, 순수한 비즈니스 로직을 관리합니다. 이를 통해 Domain Layer는 쉽게 테스트 가능하게 만듭니다.

#### 구성 요소:
- **UseCases (또는 Interactors)**: 특정 비즈니스 로직을 캡슐화한 작업 단위로, 여러 데이터 소스에서 정보를 수집하고 데이터를 처리하여 Presentation Layer에 전달합니다.
- **Entities**: 애플리케이션에서 사용되는 주요 데이터 모델을 정의합니다.

#### 예시:
```dart
class FetchUserUseCase {
  final UserRepository userRepository;

  FetchUserUseCase(this.userRepository);

  Future<User> execute(int userId) {
    return userRepository.fetchUser(userId);  // 비즈니스 로직을 처리
  }
}
```

### 3. **Presentation Layer**
#### 정의:
**Presentation Layer**는 애플리케이션의 **UI**와 **상태 관리**를 담당합니다. 이 레이어는 사용자가 애플리케이션과 상호작용하는 모든 부분을 관리하며, 사용자 입력을 받아 처리하고 데이터를 화면에 출력합니다.

#### 사용 목적:
- 사용자가 볼 수 있는 UI를 관리하며, 사용자와 상호작용하는 부분입니다. 상태가 변경될 때 UI를 업데이트하는 역할을 담당합니다.
- 사용자의 이벤트(버튼 클릭 등)에 대한 처리 로직이 포함되어 있으며, Domain Layer와 상호작용하여 비즈니스 로직을 실행하고, 그 결과를 화면에 반영합니다.

#### 구성 요소:
- **UI Widgets**: Flutter에서의 화면 구성을 담당하는 위젯들입니다.
- **State Management**: `Provider`, `MobX`, `Bloc`, `Riverpod` 등 다양한 상태 관리 패턴을 사용하여 UI와 도메인 간의 데이터를 관리하고 연결합니다.

#### 예시:
```dart
class UserScreen extends StatelessWidget {
  final FetchUserUseCase fetchUserUseCase;

  UserScreen(this.fetchUserUseCase);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("User")),
      body: FutureBuilder<User>(
        future: fetchUserUseCase.execute(1),  // UseCase 실행
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return CircularProgressIndicator();  // 로딩 중
          } else if (snapshot.hasData) {
            return Text('User: ${snapshot.data!.name}');  // 사용자 데이터 표시
          } else {
            return Text('Error: ${snapshot.error}');  // 오류 처리
          }
        },
      ),
    );
  }
}
```

---

### 전체 아키텍처 흐름:
1. **Presentation Layer**: 사용자가 앱을 열고, UI 위젯에서 버튼을 클릭하거나 데이터를 입력하면, Presentation Layer는 이벤트를 감지하고 상태를 관리합니다.
    - `UserScreen` 위젯에서 사용자가 요청한 사용자 데이터를 `FetchUserUseCase`를 통해 요청하게 됩니다.

2. **Domain Layer**: **UseCase**는 Presentation Layer로부터 받은 요청을 처리합니다. 이때 필요한 데이터를 **UserRepository**에서 가져옵니다.
    - `FetchUserUseCase`는 비즈니스 로직을 캡슐화하여 데이터를 처리한 후 결과를 Presentation Layer에 반환합니다.

3. **Data Layer**: **UserRepository**는 외부 API나 데이터베이스에서 데이터를 가져오는 작업을 수행합니다. 여기서 실제 네트워크 통신이나 데이터베이스 쿼리 등이 실행됩니다.
    - `UserRepository`는 `ApiService`와 상호작용하여 네트워크 요청을 수행하고 데이터를 가져옵니다.

### 예시 아키텍처 다이어그램:
```
+---------------------+      +-------------------+      +--------------------+
|  Presentation Layer  | ---> |   Domain Layer     | ---> |    Data Layer       |
+---------------------+      +-------------------+      +--------------------+
| - UI Widgets        |      | - UseCases         |      | - Repositories      |
| - State Management  |      | - Business Logic   |      | - Data Sources      |
+---------------------+      +-------------------+      +--------------------+
```