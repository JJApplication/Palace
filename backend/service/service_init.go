package service

var (
	UserServiceApp     *UserService
	TaskServiceApp     *TaskService
	ImageServiceApp    *ImageService
	CategoryServiceApp *CategoryService
	TagServiceApp      *TagService
)

func InitService() {
	UserServiceApp = new(UserService)
	TaskServiceApp = new(TaskService)
	ImageServiceApp = new(ImageService)
	CategoryServiceApp = new(CategoryService)
	TagServiceApp = new(TagService)
}
